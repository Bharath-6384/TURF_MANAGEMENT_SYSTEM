import { Request, Response } from "express";
import pool from "../config/database-config";
import { transporter } from "../config/mailer-config";
import { handleError } from "../middleware/error-handler";
import { BookTurf, GetAllTurfs, GetSlot, GetUserBookings, UserDashboard } from "../models/user-interface";
import logger, { serviceExecutingLog } from "../utils/logger";
import ResponseEntity from "../utils/response";
import { createNotificationRecord } from "./notification-service";

const CLASS_NAME = "UserService";

export const bookTurf = async (req: Request<{}, {}, BookTurf.Request>, res: Response) => {
  const METHOD_NAME = "bookTurf";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { email, turfId, date, startTime, endTime } = req.body;

    const userResult = await pool.query("SELECT user_id, role_id, fullname FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "User not found");
    }

    const userId = userResult.rows[0].user_id;
    const userRoleId = userResult.rows[0].role_id;
    const userName = userResult.rows[0].fullname;

    const userBooking = await pool.query(`SELECT booking_id FROM bookings WHERE user_id = $1 AND turfid = $2 AND date = $3 AND status IN ('unpaid', 'paid', 'confirmed') AND (start_time < $5 AND end_time > $4)`, [userId, turfId, date, startTime, endTime]);

    if (userBooking.rows.length > 0) {
      return ResponseEntity.error(res, 409, "You have already booked this slot.");
    }

    const overlap = await pool.query(`SELECT booking_id FROM bookings WHERE turfid = $1 AND date = $2 AND status IN ('unpaid', 'paid', 'confirmed') AND (start_time < $4 AND end_time > $3)`, [turfId, date, startTime, endTime]);

    if (overlap.rows.length > 0) {
      return ResponseEntity.error(res, 409, "Selected slot is already booked.");
    }

    const turfResult = await pool.query(`SELECT turfname, day_price, night_price FROM turfs WHERE turfid = $1`, [turfId]);

    if (turfResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Turf not found.");
    }

    const turfName = turfResult.rows[0].turfname;

    const startHour = Number(startTime.split(":")[0]);

    const pricePerHour =
      startHour >= 18 || startHour < 6
        ? Number(turfResult.rows[0].night_price)
        : Number(turfResult.rows[0].day_price);

    let duration =
      Number(endTime.split(":")[0]) -
      Number(startTime.split(":")[0]);

    if (duration <= 0) {
      duration += 24;
    }

    const totalRate = pricePerHour * duration;

    const result = await pool.query(`INSERT INTO bookings (user_id, turfid, date, start_time, end_time, total_rate, status) VALUES ($1, $2, $3, $4, $5, $6, 'unpaid') RETURNING booking_id`, [userId, turfId, date, startTime, endTime, totalRate]);

    if (!result.rowCount) {
      return ResponseEntity.error(res, 500, "Failed to book turf.");
    }

    const bookingId = result.rows[0].booking_id;

    await createNotificationRecord({
      receiverId: userId,
      roleId: userRoleId,
      title: "Booking Confirmed",
      message: `Your booking for ${turfName} on ${date} from ${startTime} to ${endTime} has been confirmed.`,
      notificationType: "booking",
      referenceId: bookingId,
      referenceType: "booking",
    });

    const adminResult = await pool.query(`SELECT admin_id, role_id FROM admin`);

    for (const admin of adminResult.rows) {
      await createNotificationRecord({
        receiverId: admin.admin_id,
        roleId: admin.role_id,
        title: "New Booking",
        message: `${userName} has booked ${turfName} on ${date} from ${startTime} to ${endTime}.`,
        notificationType: "booking",
        referenceId: bookingId,
        referenceType: "booking",
      });
    }

    await transporter.sendMail({
      from: "bharathkumar.kofficial@gmail.com",
      to: email,
      subject: "Turf Booking Confirmation",
      text: `Your turf booking has been confirmed.

      Date : ${date}

      Time : ${startTime} - ${endTime}

      Amount : ₹${totalRate}`
    });

    return ResponseEntity.success<BookTurf.Response>(
      res,
      201,
      {
        message: "Turf booked successfully.",
        totalRate
      }
    );

  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};

export const userDashboard = async (req: Request<UserDashboard.Request>, res: Response) => {
  try {
    const { userId } = req.body;

    const query = `SELECT fullname, COUNT(b.booking_id) AS "totalBookings", COUNT(CASE WHEN b.date >= CURRENT_DATE THEN 1 END) AS "upcomingBookings", COUNT(CASE WHEN LOWER(b.status) = 'completed' THEN 1 END) AS "completedBookings", COUNT(CASE WHEN LOWER(b.status) = 'missed' THEN 1 END) AS "missedBookings", COUNT(CASE WHEN LOWER(b.status) = 'unpaid' THEN 1 END) AS "unpaidBookings" FROM users u LEFT JOIN bookings b ON u.user_id = b.user_id WHERE u.user_id = $1 GROUP BY fullname`;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Dashboard data not found.");
    }

    return ResponseEntity.success(res, 200, result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return ResponseEntity.error(res, 500, error.message);
  }
};

export const getslot = async (req: Request<GetSlot.Request>, res: Response) => {
  const METHOD_NAME = "getslot";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { turfId, date } = req.body;

    if (!turfId || !date) {
      return ResponseEntity.error(res, 400, "Turf id and date are required");
    }

    const turfResult = await pool.query(`SELECT turfid FROM turfs WHERE turfid = $1`, [turfId]);

    if (turfResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "Turf not found");
    }

    const bookedSlotsResult = await pool.query(`SELECT start_time, end_time FROM bookings WHERE turfid = $1 AND date = $2 AND (status = 'unpaid' OR status = 'paid' OR status = 'confirmed')`, [turfId, date]);

    const bookedSlots = bookedSlotsResult.rows;

    const slots: GetSlot.Slot[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${((hour + 1) % 24).toString().padStart(2, "0")}:00`;

      const isBooked = bookedSlots.some((slot) => {
        const bookedStartTime = slot.start_time.substring(0, 5);
        const bookedEndTime = slot.end_time.substring(0, 5);

        return startTime >= bookedStartTime && startTime < bookedEndTime;
      });

      slots.push({ startTime, endTime, available: !isBooked });
    }

    return ResponseEntity.success<GetSlot.Response>(res, 200, { turfId, date, slots });
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

export const getUserBookings = async (req: Request<GetUserBookings.Request>, res: Response) => {
  const METHOD_NAME = "getUserBookings";
  logger.info(serviceExecutingLog(CLASS_NAME, METHOD_NAME));

  try {
    const { userId } = req.body;

    if (!userId) {
      return ResponseEntity.error(res, 400, "User id is required");
    }

    const userResult = await pool.query(`SELECT user_id FROM users WHERE user_id = $1`, [userId]);

    if (userResult.rows.length === 0) {
      return ResponseEntity.error(res, 404, "User not found");
    }

    const query = `SELECT b.booking_id, b.turfid, t.turfname, t.location, b.date, b.start_time, b.end_time, b.total_rate, b.status FROM bookings b INNER JOIN turfs t ON b.turfid = t.turfid WHERE b.user_id = $1 ORDER BY b.date DESC, b.start_time DESC`;

    const result = await pool.query(query, [userId]);

    return ResponseEntity.success<GetUserBookings.Booking[]>(res, 200, result.rows);
  } catch (error: any) {
    handleError(res, error, CLASS_NAME, METHOD_NAME);
  }
};