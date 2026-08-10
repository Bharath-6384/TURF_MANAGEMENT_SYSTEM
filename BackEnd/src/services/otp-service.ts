import pool from "../config/database-config";
import { CustomError } from "../utils/custom-error";
import { hashValues, verifyHash } from "../utils/hash-utils";
import crypto from "crypto";


export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtp = async (identifier: string ,otp: string, otpPurpose: string,) => {
    try {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const hashedOtp = await hashValues(otp);
        
        const existingOtp = await pool.query("SELECT id FROM otp_verifications where identifier = $1 and otp_purpose = $2", [identifier, otpPurpose]);

        if(existingOtp.rowCount === 0) {
            const result = await pool.query("INSERT INTO otp_verifications(identifier, otp_hash, otp_purpose, expires_at) VALUES ($1, $2, $3, $4)", [identifier, hashedOtp, otpPurpose, expiresAt]);
        
            if (result.rowCount !== 1) {
                throw new Error("OTP not stored");
            }
        } else {
            const result = await pool.query(`UPDATE otp_verifications SET otp_hash = $1, expires_at = $2, attempts = 0, created_at = now() WHERE identifier = $3 AND otp_purpose = $4`,[hashedOtp, expiresAt, identifier, otpPurpose]);

            if (result.rowCount !== 1) {
                throw new Error("OTP not stored");
            }
        }
    
    } catch(error: any) {
        throw error;
    }
}

export const storePasswordResetToken = async (identifier:string, value: string, roleId: number) => {
    try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const tokenHash = crypto.createHash("sha256").update(value).digest("hex");

        const result = await pool.query(`INSERT INTO password_reset_token(email, token_hash, expires_at, created_at, role_id) VALUES ($1, $2, $3, NOW(), $4) ON CONFLICT (email) DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at, role_id = EXCLUDED.role_id, created_at = NOW();`, [identifier, tokenHash, expiresAt, roleId]);

        if (result.rowCount !== 1) {
            throw new Error("Password reset token not stored");
        }

    } catch (error: any) {
        throw error;
    }
}

export const getStoredOtp = async (identifier: string, otpPurpose: string) => {

  const result = await pool.query("SELECT otp_hash FROM otp_verifications WHERE identifier = $1 AND otp_purpose = $2 AND expires_at > NOW()", [identifier, otpPurpose]);

  if (result.rowCount === 0) {
    throw new CustomError(400, "OTP not found or expired");
  }

  return result.rows[0].otp_hash;
};

export const verifyHashOtp = async (otp: string, hashedOtp: string, identifier: string, otpPurpose: string) => {

  const isValid = await verifyHash(otp, hashedOtp);

  if (!isValid) {
    const result = await pool.query("UPDATE otp_verifications SET attempts = attempts + 1 WHERE identifier = $1 AND otp_purpose = $2 AND expires_at > NOW() RETURNING attempts", [identifier, otpPurpose]);

    if (result.rowCount === 0) {
      throw new CustomError(400, "OTP expired or already used");
    }

    const attempts = result.rows[0].attempts;
    const remainingAttempts = 5 - attempts;

    if (remainingAttempts <= 0) {
      throw new CustomError(429, "OTP blocked due to too many attempts");
    }

    throw new CustomError(400,`Invalid OTP. Remaining attempts: ${remainingAttempts}`);
  }

  const updateResult = await pool.query("DELETE FROM otp_verifications WHERE identifier = $1 AND otp_purpose = $2 AND expires_at > NOW() RETURNING id;", [identifier, otpPurpose]);

  if (updateResult.rowCount === 0) {
    throw new CustomError(400, "OTP expired or already used");
  }

  return true;
};