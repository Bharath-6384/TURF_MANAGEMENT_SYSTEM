import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import pool from "../config/database-config";
import { transporter } from "../config/mailer-config";
import { handleError } from "../middleware/error-handler";
import { AdminDashboard, DeleteTurf, GetAllBookings, GetAllPayments, GetAllTurfs, GetAllUsers, RegisterTurf, UpdateBooking, UpdateTurf, UpdateUser } from "../models/admin-interface";
import logger, { serviceExecutingLog } from "../utils/logger";
import ResponseEntity from "../utils/response";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { createNotificationRecord } from "./notification-service";

const CLASS_NAME = "AdminService";

async function isEmailTaken(email: string): Promise<boolean> {
  const result = await pool.query(`SELECT email FROM admin WHERE email = $1`, [email]);
  return result.rows.length > 0;
}

export const registerTurf = async (req: Request, res: Response) => {
  const METHOD_NAME = "registerTurf";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { turfName, turfLocation, dayPrice, nightPrice, email, contactNo } = req.body;
    const adminId = req.params.adminId;
    const checkAdmin = await pool.query("SELECT admin_id FROM admin WHERE admin_id = $1", [adminId]);

    if (checkAdmin.rows.length === 0) {
      return ResponseEntity.error(res, 400, "Admin not found");
    }

    const turfExists = await pool.query("SELECT turfid FROM turfs WHERE turfname = $1 AND location = $2", [turfName, turfLocation]);

    if (await isEmailTaken(email)) {
      return ResponseEntity.error(res, 400, "Email already exists");
    }

    if (turfExists.rows.length > 0) {
      return ResponseEntity.error(res, 400, "Turf already exists");
    }

    let imageUrl: string | null = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "turf-images");
      imageUrl = uploadResult.secure_url;
    }

    const insertTurfQuery = `INSERT INTO turfs (turfname, location, day_price, night_price, email, contact_no, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const insertResult = await pool.query(insertTurfQuery, [turfName, turfLocation, dayPrice, nightPrice, email, contactNo, imageUrl]);

    const turf = insertResult.rows[0];

    const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin`);

    for (const admin of adminResult.rows) {
      await createNotificationRecord({
        receiverId: admin.admin_id,
        roleId: admin.role_id,
        title: "New Turf Registered",
        message: `${turfName} at ${turfLocation} has been registered.`,
        notificationType: "turf",
        referenceId: turf.turfid,
        referenceType: "turf",
      });
    }

    await transporter.sendMail({
      from: "bharathkumar.kofficial@gmail.com",
      to: email,
      subject: "Turf Registration Successful",
      text: `Your turf has been registered successfully on Field-Go.

      Turf Name : ${turfName}

      Location : ${turfLocation}

      Day Price : ₹${dayPrice}

      Night Price : ₹${nightPrice}`
    });

    return ResponseEntity.success<RegisterTurf.Response>(res, 201, { turf });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const getAllTurfs = async (req: Request, res: Response) => {
  const METHOD_NAME = "getAllTurfs";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const query = `SELECT turfid, turfname, location, day_price, night_price, email, status, contact_no, image_url FROM turfs ORDER BY turfid DESC`;
    const result = await pool.query(query);

    return ResponseEntity.success<GetAllTurfs.Turf[]>(res, 200, result.rows);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  const METHOD_NAME = "getAllBookings";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const query = `SELECT b.booking_id, u.fullname, b.date, b.start_time, b.end_time, b.total_rate, b.status, t.turfid, t.turfname, t.day_price, t.night_price, u.email FROM bookings b JOIN turfs t ON t.turfid = b.turfid JOIN users u ON u.user_id = b.user_id ORDER BY b.booking_id DESC`;
    const result = await pool.query(query);

    return ResponseEntity.success<GetAllBookings.Booking[]>(res, 200, result.rows);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  const METHOD_NAME = "getAllPayments";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const query = `SELECT p.paymentid, p.bookingid, p.amount, p.paymentmode, p.status, p.createddate, b.turfid, t.turfname, b.date AS booking_date, b.start_time, b.end_time, u.email AS customer_email FROM payments p JOIN bookings b ON b.booking_id = p.bookingid JOIN turfs t ON t.turfid = b.turfid JOIN users u ON u.user_id = b.user_id ORDER BY p.paymentid DESC`;
    const result = await pool.query(query);

    return ResponseEntity.success<GetAllPayments.Payment[]>(res, 200, result.rows);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const METHOD_NAME = "getAllUsers";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const query = `SELECT u.user_id, u.email, u.fullname, u.phone, u.datetime_reg, r.role_name FROM users u LEFT JOIN roles r ON r.role_id = u.role_id ORDER BY u.user_id DESC`;
    const result = await pool.query(query);

    return ResponseEntity.success<GetAllUsers.User[]>(res, 200, result.rows);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const adminDashboard = async (req: Request<AdminDashboard.Request>, res: Response) => {
  try {
    const { adminId } = req.body;

    const query = `SELECT a.fullname AS "adminName", (SELECT COUNT(*)::INT FROM turfs) AS "totalTurfs", (SELECT COUNT(*)::INT FROM users) AS "totalCustomers", (SELECT COUNT(*)::INT FROM bookings) AS "totalBookings", (SELECT COUNT(*)::INT FROM bookings WHERE date = CURRENT_DATE) AS "todayBookings", (SELECT COUNT(*)::INT FROM bookings WHERE LOWER(status) = 'pending') AS "pendingBookings", (SELECT COUNT(*)::INT FROM bookings WHERE LOWER(status) = 'completed') AS "completedBookings", (SELECT COALESCE(SUM(total_rate), 0)::NUMERIC(12, 2) FROM bookings WHERE LOWER(status) = 'completed') AS "totalRevenue", (SELECT COUNT(*)::INT FROM turfs WHERE status = 'available') AS "availableTurfs" FROM admin a WHERE a.admin_id = $1`;
    const result = await pool.query(query, [adminId]);

    if (result.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Dashboard data not found.");
    }

    return ResponseEntity.success(res, 200, result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return ResponseEntity.error(res, 500, error.message);
  }
};

export const updateBooking = async (req: Request<UpdateBooking.Params, {}, UpdateBooking.Request>, res: Response) => {
  const METHOD_NAME = "updateBooking";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    const bookingResult = await pool.query(`SELECT b.booking_id, b.user_id, b.status, b.date, b.start_time, b.end_time, b.total_rate, u.email, u.fullname, u.role_id, t.turfname FROM bookings b JOIN users u ON b.user_id = u.user_id JOIN turfs t ON b.turfid = t.turfid WHERE b.booking_id = $1`, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Booking not found");
    }

    const booking = bookingResult.rows[0];

    const updateResult = await pool.query(`UPDATE bookings SET status = $1 WHERE booking_id = $2 RETURNING booking_id, status`, [status, bookingId]);

    if (status === "paid" && booking.status !== "paid") {

      await createNotificationRecord({
        receiverId: booking.user_id,
        roleId: booking.role_id,
        title: "Payment Successful",
        message: `Your payment of ₹${booking.total_rate} for ${booking.turfname} on ${booking.date} has been successfully received.`,
        notificationType: "success",
        referenceId: booking.booking_id,
        referenceType: "booking",
      });

      const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin`);

      for (const admin of adminResult.rows) {

        await createNotificationRecord({
          receiverId: admin.admin_id,
          roleId: admin.role_id,
          title: "Payment Successful",
          message: `Payment of ₹${booking.total_rate} has been received from ${booking.fullname} for ${booking.turfname}.`,
          notificationType: "success",
          referenceId: booking.booking_id,
          referenceType: "booking",
        });

      }

      await transporter.sendMail({
        from: "bharathkumar.kofficial@gmail.com",
        to: booking.email,
        subject: "Payment Confirmed - Turf Booking",
        text: `Your payment has been successfully confirmed.

        Booking ID : ${booking.booking_id}

        Turf : ${booking.turfname}

        Date : ${booking.date}

        Time : ${booking.start_time} - ${booking.end_time}

        Amount Paid : ₹${booking.total_rate}

        Thank you for booking with Field-Go.`
      });

    }

    return ResponseEntity.success<UpdateBooking.Response>(res, 200, {
      message: "Booking payment status updated successfully",
      booking: updateResult.rows[0]
    });

  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const deleteFromCloudinary = async (imageUrl: string) => {
  const urlParts = imageUrl.split("/");
  const uploadIndex = urlParts.indexOf("upload");
  const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));

  return await cloudinary.uploader.destroy(publicId);
};

export const deleteTurf = async (req: Request<DeleteTurf.Params>, res: Response) => {
  const METHOD_NAME = "deleteTurf";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { turfid } = req.params;

    const turfQuery = `SELECT turfname, email, image_url FROM turfs WHERE turfid = $1`;
    const turfResult = await pool.query(turfQuery, [turfid]);

    if (turfResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Turf not found");
    }

    const { turfname, email, image_url: imageUrl } = turfResult.rows[0];

    if (imageUrl) {
      await deleteFromCloudinary(imageUrl);
    }

    const deleteQuery = `DELETE FROM turfs WHERE turfid = $1 RETURNING turfid`;
    const result = await pool.query(deleteQuery, [turfid]);

    await transporter.sendMail({
      from: "bharathkumar.kofficial@gmail.com",
      to: email,
      subject: "Turf Removed - Field-Go",
      text: `Your turf listing has been removed from Field-Go.

      Turf Name : ${turfname}

      If you believe this was a mistake, please contact support.`
    });

    return ResponseEntity.success<DeleteTurf.Response>(res, 200, {
      message: "Turf deleted successfully",
      turfid: result.rows[0].turfid
    });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const updateTurf = async (req: Request, res: Response) => {
  const METHOD_NAME = "updateTurf";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { turfid } = req.params;
    logger.info(`Turf ID: ${turfid}`);

    const { turfname, day_price, night_price, location, email, contact_no, status } = req.body;

    const turfQuery = `SELECT image_url FROM turfs WHERE turfid = $1`;
    const turfResult = await pool.query(turfQuery, [turfid]);

    if (turfResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Turf not found");
    }

    let imageUrl = turfResult.rows[0].image_url;

    if (req.file) {
      if (imageUrl) {
        await deleteFromCloudinary(imageUrl);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, "turf-images");
      imageUrl = uploadResult.secure_url;
    }

    const query = `UPDATE turfs SET turfname = $1, day_price = $2, night_price = $3, location = $4, email = $5, contact_no = $6, status = $7, image_url = $8 WHERE turfid = $9 RETURNING turfid, turfname, day_price, night_price, location, email, contact_no, status, image_url`;
    const values = [turfname, day_price, night_price, location, email, contact_no, status, imageUrl, turfid];
    const result = await pool.query(query, values);

    const turf = result.rows[0];

    try {
      const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin`);

      for (const admin of adminResult.rows) {
        await createNotificationRecord({
          receiverId: admin.admin_id,
          roleId: admin.role_id,
          title: "Turf Updated",
          message: `${turf.turfname} at ${turf.location} has been updated.`,
          notificationType: "turf",
          referenceId: turf.turfid,
          referenceType: "turf",
        });
      }

      await transporter.sendMail({
        from: "bharathkumar.kofficial@gmail.com",
        to: turf.email,
        subject: "Turf Details Updated - Field-Go",
        text: `Your turf details have been updated on Field-Go.

        Turf Name : ${turf.turfname}

        Location : ${turf.location}

        Day Price : ₹${turf.day_price}

        Night Price : ₹${turf.night_price}

        Status : ${turf.status}`
      });
    } catch (notifyError: any) {
      logger.error(`updateTurf notification/mail failed: ${notifyError.message}`);
    }

    return ResponseEntity.success<UpdateTurf.Response>(res, 200, turf);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const updateUser = async (req: Request<UpdateUser.Params, {}, UpdateUser.Request>, res: Response) => {
  const METHOD_NAME = "updateUser";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { userId } = req.params;
    const { fullname, email, phone } = req.body;

    const query = `UPDATE users SET fullname = $1, email = $2, phone = $3 WHERE user_id = $4 RETURNING user_id, fullname, email, phone, role_id`;
    const result = await pool.query(query, [fullname, email, phone, userId]);

    if (result.rows.length === 0) {
      return ResponseEntity.error(res, 404, "User not found");
    }

    const user = result.rows[0];

    try {
      await createNotificationRecord({
        receiverId: user.user_id,
        roleId: user.role_id,
        title: "Profile Updated",
        message: `Your profile details have been updated.`,
        notificationType: "profile",
        referenceId: user.user_id,
        referenceType: "user",
      });

      await transporter.sendMail({
        from: "bharathkumar.kofficial@gmail.com",
        to: user.email,
        subject: "Profile Updated - Field-Go",
        text: `Your profile has been updated successfully.

        Name : ${user.fullname}

        Phone : ${user.phone}`
      });
    } catch (notifyError: any) {
      logger.error(`updateUser notification/mail failed: ${notifyError.message}`);
    }

    return ResponseEntity.success<UpdateUser.Response>(res, 200, {
      message: "User updated successfully",
      user
    });
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};