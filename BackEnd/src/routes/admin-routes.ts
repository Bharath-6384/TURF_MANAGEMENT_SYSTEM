import { Router } from "express";
import * as AdminController from '../controllers/admin-controller'
import { AdminDashboard, DeleteTurf, GetAllBookings, GetAllPayments, GetAllTurfs, GetAllUsers, RegisterTurf, UpdateBooking, UpdateTurf, UpdateUser } from '../models/admin-interface';
import verifyJWT from "../middleware/verifyJWT";
import {Roles}  from "../constants/role-constants"
import upload from "../config/multer";

const router = Router();

router.post(RegisterTurf.path, verifyJWT([Roles.ADMIN]), upload.single("image"), AdminController.registerTurf);

router.get(GetAllTurfs.path, verifyJWT([Roles.ADMIN, Roles.USER]), AdminController.getAllTurfs);

router.get(GetAllBookings.path, verifyJWT([Roles.ADMIN]), AdminController.getAllBookings);

router.get(GetAllPayments.path, verifyJWT([Roles.ADMIN]), AdminController.getAllPayments);

router.get(GetAllUsers.path, verifyJWT([Roles.ADMIN]), AdminController.getAllUsers);

router.post(AdminDashboard.path, verifyJWT([Roles.ADMIN]), AdminController.adminDashboard);

router.put(UpdateBooking.path, verifyJWT([Roles.ADMIN]), AdminController.updateBooking);

router.put(UpdateTurf.path, verifyJWT([Roles.ADMIN]), upload.single("image"), AdminController.updateTurf);

router.delete(DeleteTurf.path, verifyJWT([Roles.ADMIN]), AdminController.deleteTurf);

router.put(UpdateUser.path, verifyJWT([Roles.ADMIN]), AdminController.updateUser);

export default router;
