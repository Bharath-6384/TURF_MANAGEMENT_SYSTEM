import jwt from "jsonwebtoken";
import pool from "../config/database-config";
import ResponseEntity from "../utils/response";
import logger from "../utils/logger";
import { NextFunction } from "express";
import { JwtUser } from "../models/auth-interface";

const verifyJWT = (allowedRoles: string[] = []) => {
  return async (req: any, res: any, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return ResponseEntity.error(res, 401, "No token provided");
        }

        const token = authHeader.split(" ")[1];

        const decodedHeader = jwt.decode(token) as JwtUser | null;

        if (!decodedHeader?.role) {
            return ResponseEntity.error(res, 401, "Invalid token payload");
        }

        const roleName = decodedHeader.role;

        const secretRes = await pool.query(
            "SELECT jwt_secret FROM roles WHERE role_name = $1",
            [roleName]
        );

        if (secretRes.rows.length === 0) {
            return ResponseEntity.error(res, 401, "Unknown role");
        }

        const jwtSecret = secretRes.rows[0].jwt_secret;

        const decoded = jwt.verify(token, jwtSecret, {
            algorithms: ["HS256"],
        }) as JwtUser;

        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
            return ResponseEntity.error(res, 403, "Access denied");
        }

        (req as any).user = decoded;

      next();
    } catch (error: any) {
        logger.error("JWT verification error:", error.message);
        return ResponseEntity.error(res, 401, "Invalid or expired token");
    }
  };
};

export default verifyJWT;
