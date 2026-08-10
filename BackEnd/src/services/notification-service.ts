import pool from "../config/database-config";
import logger from "../utils/logger";
import { CreateNotificationRecord } from "../models/common-interface";

export async function createNotificationRecord(params: CreateNotificationRecord.Params) {
  const { receiverId, roleId, title, message, notificationType, referenceId, referenceType } = params;

  try {
    const notificationResult = await pool.query(
      `INSERT INTO notifications (receiver_id, role_id, title, message, notification_type, reference_id, reference_type, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, false, CURRENT_TIMESTAMP) RETURNING notification_id`,
      [receiverId, roleId, title, message, notificationType, referenceId, referenceType]
    );

    if (notificationResult.rows.length === 0) {
      throw new Error("Failed to create notification");
    }

    return notificationResult.rows[0].notification_id;
  } catch (error: any) {
    logger.error(`createNotificationRecord failed: ${error.message}`);
    return null;
  }
}