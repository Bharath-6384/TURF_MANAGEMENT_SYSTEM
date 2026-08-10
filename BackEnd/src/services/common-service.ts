import crypto from "crypto";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import pool from "../config/database-config";
import { transporter } from "../config/mailer-config";
import { OtpPurpose } from "../constants/otp-purpose";
import { handleError } from "../middleware/error-handler";
import { ForgotPassword, GetNotifications, GetProfile, MarkAllNotificationsRead, ResetPassword, Signup, UpdateProfile, VerifyPasswordOtp } from "../models/common-interface";
import logger, { serviceExecutingLog } from "../utils/logger";
import ResponseEntity from "../utils/response";
import { createNotificationRecord } from "./notification-service";
import { storeOtp, storePasswordResetToken, generateOtp, getStoredOtp, verifyHashOtp } from "./otp-service";

const CLASS_NAME = "CommonApiService";

export const forgotPassword = async (req: Request<{}, {}, ForgotPassword.Request>, res: Response) => {
  const METHOD_NAME = "forgotPassword";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email } = req.body;

    if (!email) {
      return ResponseEntity.error(res, 400, "Email is required");
    }

    const userRecord = await pool.query(`SELECT email, role_id FROM users WHERE email = $1 LIMIT 1`, [email]);

    if (userRecord.rows.length !== 1) {
      return ResponseEntity.error(res, 404, "Email not found");
    }

    const otpCode = generateOtp();
    await storeOtp(email, otpCode, OtpPurpose.RESET_PASSWORD);

    await transporter.sendMail({
      from: "bharathkumar.kofficail@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otpCode}`,
    });

    return ResponseEntity.success<ForgotPassword.Response>(res, 200, { message: "OTP sent successfully" });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const verifyPasswordOtp = async (req: Request<{}, {}, VerifyPasswordOtp.Request>, res: Response) => {
  const METHOD_NAME = "verifyPasswordOtp";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ResponseEntity.error(res, 400, "Email and OTP are required");
    }

    const userRecord = await pool.query(`SELECT email, role_id FROM users WHERE email = $1 LIMIT 1`, [email]);

    if (userRecord.rows.length !== 1) {
      return ResponseEntity.error(res, 404, "Email not found");
    }

    const stored = await getStoredOtp(email, OtpPurpose.RESET_PASSWORD);

    if (!stored) {
      return ResponseEntity.error(res, 400, "No OTP found or expired");
    }

    const isValidOtp = await verifyHashOtp(otp, stored, email, OtpPurpose.RESET_PASSWORD);

    if (!isValidOtp) {
      return ResponseEntity.error(res, 400, "Invalid OTP");
    }

    const resetToken = crypto.randomUUID();
    await storePasswordResetToken(email, resetToken, userRecord.rows[0].role_id);

    return ResponseEntity.success<VerifyPasswordOtp.Response>(res, 200, {
      success: true,
      message: "OTP verified successfully",
      token: resetToken,
    });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const resetPassword = async (req: Request<{}, {}, ResetPassword.Request>, res: Response) => {
  const METHOD_NAME = "resetPasswordService";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  const client = await pool.connect();

  try {
    const { newPassword, resetToken } = req.body;

    if (!newPassword || !resetToken) {
      return ResponseEntity.error(res, 400, "Password and token are required");
    }

    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await client.query("BEGIN");

    const deleteTokenRes = await client.query(`DELETE FROM password_reset_token WHERE token_hash = $1 AND expires_at > NOW() RETURNING email, role_id;`, [tokenHash]);

    if (deleteTokenRes.rows.length !== 1) {
      await client.query("ROLLBACK");
      return ResponseEntity.error(res, 400, "Invalid or expired token");
    }

    const { email, role_id } = deleteTokenRes.rows[0];

    const userRecord = await client.query(`SELECT user_id, email, role_id FROM users WHERE email = $1 AND role_id = $2 LIMIT 1`, [email, role_id]);

    if (userRecord.rows.length !== 1) {
      await client.query("ROLLBACK");
      return ResponseEntity.error(res, 404, "User not found");
    }

    const hashedPassword = CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex);
    const updateRes = await client.query(`UPDATE users SET passwd = $1 WHERE email = $2`, [hashedPassword, email]);

    if (updateRes.rowCount !== 1) {
      await client.query("ROLLBACK");
      return ResponseEntity.error(res, 404, "Unable to update password");
    }

    await client.query("COMMIT");

    const { user_id: userId } = userRecord.rows[0];

    try {
      await createNotificationRecord({
        receiverId: userId,
        roleId: role_id,
        title: "Password Changed",
        message: "Your password was successfully reset. If this wasn't you, please contact support immediately.",
        notificationType: "security",
        referenceId: userId,
        referenceType: "user",
      });

      await transporter.sendMail({
        from: "bharathkumar.kaliraj@atdxt.com",
        to: email,
        subject: "Your Password Has Been Reset",
        text: `Your password was successfully reset.

        If you did not perform this action, please contact support immediately.`,
      });
    } catch (notifyError: any) {
      logger.error(`resetPassword notification/mail failed: ${notifyError.message}`);
    }

    return ResponseEntity.success<ResetPassword.Response>(res, 200, { message: "Password updated successfully" });
  } catch (error: any) {
    await client.query("ROLLBACK");
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  } finally {
    client.release();
  }
};

export const getProfile = async (req: Request<{}, {}, GetProfile.Request>, res: Response) => {
  const METHOD_NAME = "getProfile";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email } = req.body;

    if (!email) {
      return ResponseEntity.error(res, 400, "Email is required.");
    }

    const userResult = await pool.query(`SELECT user_id AS id, email, fullname, phone, datetime_reg, 'user' AS role FROM users WHERE email = $1`, [email]);

    if (userResult.rows.length > 0) {
      return ResponseEntity.success<GetProfile.Profile>(res, 200, userResult.rows[0]);
    }

    const adminResult = await pool.query(`SELECT admin_id AS id, email, fullname, phone, datetime_reg, 'admin' AS role FROM admin WHERE email = $1`, [email]);

    if (adminResult.rows.length > 0) {
      return ResponseEntity.success<GetProfile.Profile>(res, 200, adminResult.rows[0]);
    }

    return ResponseEntity.error(res, 404, "Profile not found.");
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const updateProfile = async (req: Request<{}, {}, UpdateProfile.Request>, res: Response) => {
  const METHOD_NAME = "updateProfile";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email, fullname, phone } = req.body;

    if (!email) {
      return ResponseEntity.error(res, 400, "Email is required.");
    }

    if (!fullname || !fullname.trim()) {
      return ResponseEntity.error(res, 400, "Full name is required.");
    }

    if (!phone || !phone.trim()) {
      return ResponseEntity.error(res, 400, "Phone number is required.");
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return ResponseEntity.error(res, 400, "Phone number must contain exactly 10 digits.");
    }

    const userQuery = `UPDATE users SET fullname = $1, phone = $2 WHERE email = $3 RETURNING user_id AS id, email, fullname, phone, datetime_reg, role_id, 'user' AS role`;
    const userResult = await pool.query(userQuery, [fullname.trim(), phone.trim(), email]);

    if (userResult.rows.length > 0) {
      const profile = userResult.rows[0];

      try {
        await createNotificationRecord({
          receiverId: profile.id,
          roleId: profile.role_id,
          title: "Profile Updated",
          message: "Your profile details have been updated.",
          notificationType: "profile",
          referenceId: profile.id,
          referenceType: "user",
        });

        await transporter.sendMail({
          from: "bharathkumar.kaliraj@atdxt.com",
          to: profile.email,
          subject: "Profile Updated - Field-Go",
          text: `Your profile has been updated successfully.

          Name : ${profile.fullname}

          Phone : ${profile.phone}`,
        });
      } catch (notifyError: any) {
        logger.error(`updateProfile notification/mail failed: ${notifyError.message}`);
      }

      return ResponseEntity.success<UpdateProfile.Profile>(res, 200, profile);
    }

    const adminQuery = `UPDATE admin SET fullname = $1, phone = $2 WHERE email = $3 RETURNING admin_id AS id, email, fullname, phone, datetime_reg, role_id, 'admin' AS role`;
    const adminResult = await pool.query(adminQuery, [fullname.trim(), phone.trim(), email]);

    if (adminResult.rows.length > 0) {
      const profile = adminResult.rows[0];

      try {
        await createNotificationRecord({
          receiverId: profile.id,
          roleId: profile.role_id,
          title: "Profile Updated",
          message: "Your profile details have been updated.",
          notificationType: "profile",
          referenceId: profile.id,
          referenceType: "admin",
        });

        await transporter.sendMail({
          from: "bharathkumar.kaliraj@atdxt.com",
          to: profile.email,
          subject: "Profile Updated - Field-Go",
          text: `Your profile has been updated successfully.

          Name : ${profile.fullname}

          Phone : ${profile.phone}`,
        });
      } catch (notifyError: any) {
        logger.error(`updateProfile notification/mail failed: ${notifyError.message}`);
      }

      return ResponseEntity.success<UpdateProfile.Profile>(res, 200, profile);
    }

    return ResponseEntity.error(res, 404, "Profile not found.");
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const signup = async (req: Request<{}, {}, Signup.Request>, res: Response) => {
  const METHOD_NAME = "signup";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email, password, fullname, phone } = req.body;

    if (!email || !email.trim()) {
      return ResponseEntity.error(res, 400, "Email is required.");
    }

    if (!password || !password.trim()) {
      return ResponseEntity.error(res, 400, "Password is required.");
    }

    if (!fullname || !fullname.trim()) {
      return ResponseEntity.error(res, 400, "Full name is required.");
    }

    if (!phone || !phone.trim()) {
      return ResponseEntity.error(res, 400, "Phone number is required.");
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return ResponseEntity.error(res, 400, "Phone number must contain exactly 10 digits.");
    }

    const emailCheck = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email.trim()]);

    if (emailCheck.rows.length > 0) {
      return ResponseEntity.error(res, 409, "Email already registered.");
    }

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    const insertQuery = `INSERT INTO users (email, passwd, fullname, phone, datetime_reg) VALUES ($1, $2, $3, $4, NOW()) RETURNING user_id AS id, email, fullname, phone, datetime_reg, role_id`;
    const userResult = await pool.query(insertQuery, [email.trim(), hashedPassword, fullname.trim(), phone.trim()]);

    const user = userResult.rows[0];

    try {
      await createNotificationRecord({
        receiverId: user.id,
        roleId: user.role_id,
        title: "Welcome to Field-Go",
        message: `Welcome ${user.fullname}, your account has been created successfully.`,
        notificationType: "account",
        referenceId: user.id,
        referenceType: "user",
      });

      await transporter.sendMail({
        from: "bharathkumar.kaliraj@atdxt.com",
        to: user.email,
        subject: "Welcome to Field-Go",
        text: `Hi ${user.fullname},

        Your Field-Go account has been created successfully.

        Email : ${user.email}
        Phone : ${user.phone}

        Thanks for signing up!`,
      });
    } catch (notifyError: any) {
      logger.error(`signup notification/mail failed: ${notifyError.message}`);
    }

    return ResponseEntity.success<Signup.Response>(res, 201, user);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const getNotifications = async (req: Request<{}, {}, GetNotifications.Request>, res: Response) => {
  const METHOD_NAME = "getNotifications";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email } = req.body;

    if (!email) {
      return ResponseEntity.error(res, 400, "Email is required");
    }

    let receiverId: number | null = null;
    let roleId: number | null = null;

    const userResult = await pool.query(`SELECT user_id, role_id FROM users WHERE email = $1`, [email]);

    if (userResult.rows.length > 0) {
      receiverId = userResult.rows[0].user_id;
      roleId = userResult.rows[0].role_id;
    } else {
      const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin WHERE email = $1`, [email]);

      if (adminResult.rows.length > 0) {
        receiverId = adminResult.rows[0].admin_id;
        roleId = adminResult.rows[0].role_id;
      }
    }

    if (!receiverId || !roleId) {
      return ResponseEntity.error(res, 404, "User not found");
    }

    const query = `SELECT notification_id, title, message, notification_type, is_read, reference_id, reference_type, created_at FROM notifications WHERE receiver_id = $1 AND role_id = $2 ORDER BY created_at DESC`;
    const notificationResult = await pool.query(query, [receiverId, roleId]);

    return ResponseEntity.success<GetNotifications.Response>(res, 200, { notifications: notificationResult.rows });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const markAllNotificationsRead = async (req: Request<{}, {}, MarkAllNotificationsRead.Request>, res: Response) => {
  const METHOD_NAME = "markAllNotificationsRead";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email } = req.body;

    if (!email) {
      return ResponseEntity.error(res, 400, "Email is required");
    }

    let receiverId: number | null = null;
    let roleId: number | null = null;

    const userResult = await pool.query(`SELECT user_id, role_id FROM users WHERE email = $1`, [email]);

    if (userResult.rows.length > 0) {
      receiverId = userResult.rows[0].user_id;
      roleId = userResult.rows[0].role_id;
    } else {
      const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin WHERE email = $1`, [email]);

      if (adminResult.rows.length > 0) {
        receiverId = adminResult.rows[0].admin_id;
        roleId = adminResult.rows[0].role_id;
      }
    }

    if (!receiverId || !roleId) {
      return ResponseEntity.error(res, 404, "User not found");
    }

    const updateResult = await pool.query(`UPDATE notifications SET is_read = true WHERE receiver_id = $1 AND role_id = $2 AND is_read = false`, [receiverId, roleId]);

    return ResponseEntity.success<MarkAllNotificationsRead.Response>(res, 200, {
      message: "All notifications marked as read",
      updatedCount: updateResult.rowCount || 0,
    });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};