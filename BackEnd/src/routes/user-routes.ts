import { Router } from "express";
import * as UserController from '../controllers/user-controller'
import { BookTurf, GetAllTurfs, GetSlot, GetUserBookings, UserDashboard } from '../models/user-interface'
import verifyJWT from "../middleware/verifyJWT";
import {Roles}  from "../constants/role-constants"

const router = Router();

router.post(BookTurf.path, verifyJWT([Roles.USER]),UserController.registerTurf);

router.post(UserDashboard.path, verifyJWT([Roles.USER]), UserController.userDashboard);

router.post(GetSlot.path, verifyJWT([Roles.USER]), UserController.getSlot);

router.get(GetAllTurfs.path, verifyJWT([Roles.ADMIN, Roles.USER]), UserController.getAllTurfs);

router.post(GetUserBookings.path, verifyJWT([Roles.USER]), UserController.getUserBookings);

export default router;