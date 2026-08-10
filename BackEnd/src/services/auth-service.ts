import CryptoJS from 'crypto-js'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import pool from '../config/database-config'
import { roleTables } from '../constants/roles'
import { handleError } from '../middleware/error-handler'
import type { Login } from '../models/auth-interface'
import logger, { serviceExecutingLog } from '../utils/logger'
import ResponseEntity from '../utils/response'

const CLASS_NAME = 'UserService'

export const login = async(req:Request<{},{},Login.Request>, res:Response ) => {
    const METHOD_NAME = "login";
    logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));
    const { email, password, role } = req.body as Login.Request;
    
      const config = roleTables.find(r => r.role === role);
      if (!config) {
        return ResponseEntity.error(res,400,"Invalid role");
      }
    
      try {
        const loginQuery = `SELECT * FROM ${config.tableName} WHERE email = $1`;
        const result = await pool.query(loginQuery, [email]);
    
        if (result.rows.length === 0) {
            return ResponseEntity.error(res,400,"Invalid email or password");
        }
    
        const user = result.rows[0];
        const storedPassword = user.passwd;
    
        let isMatch = false;
        const isHashed = /^[a-f0-9]{64}$/i.test(storedPassword);
        if (isHashed) {
          const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
          isMatch = hashed === storedPassword;
        } else {
          isMatch = password === storedPassword;
        }
    
        if (!isMatch) {
            return ResponseEntity.error(res,400,"Invalid email or password");
        }
    
        const roleRes = await pool.query(
          'SELECT jwt_secret, role_id FROM roles WHERE role_name=$1',
          [role]
        );
        if (!roleRes.rows.length) {
            return ResponseEntity.error(res,400,"Role not found");
        }
        const { jwt_secret, role_id } = roleRes.rows[0];
    
        const token = jwt.sign(
          { id: user[config.idColumn], email: user.email, role },
          jwt_secret,
          {algorithm: "HS256", expiresIn: role === 'user' ? '1h' : '12h' }
        );
    
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + (role === 'user' ? 1 : 12));
    
        const existing = await pool.query(
          `SELECT * FROM auth_tokens 
           WHERE user_id=$1 AND role_id=$2 
           ORDER BY created_at DESC LIMIT 1`,
          [user[config.idColumn], role_id]
        );
    
        if (existing.rows.length > 0) {
          await pool.query(
            `UPDATE auth_tokens 
             SET token=$1, created_at=$2, expires_at=$3, is_active=TRUE 
             WHERE user_id=$4 AND role_id=$5`,
            [token, now, expiresAt, user[config.idColumn], role_id]
          );
        } else {
          await pool.query(
            `INSERT INTO auth_tokens (user_id, role_id, token, created_at, expires_at, is_active)
             VALUES ($1, $2, $3, $4, $5, TRUE)`,
            [user[config.idColumn], role_id, token, now, expiresAt]
          );
        }

        return ResponseEntity.success(res,200,{
          token,
          email: user.email,
          id: user[config.idColumn],
          name: user.fullname || null,
        } ) as Login.Response
      } catch (error:any) {
          handleError(res, error, CLASS_NAME, METHOD_NAME);
      }
}