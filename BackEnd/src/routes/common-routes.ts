import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as CommonApiController from '../controllers/common-controller';
import { Roles } from "../constants/role-constants";
import { ForgotPassword, GetNotifications, GetProfile, MarkAllNotificationsRead, ResetPassword, Signup, UpdateProfile, VerifyPasswordOtp } from "../models/common-interface";

const router = Router();

router.post(ForgotPassword.path, CommonApiController.forgotPassword);

router.post(VerifyPasswordOtp.path, CommonApiController.verifyPasswordOtp);

router.post(ResetPassword.path, CommonApiController.resetPassword);

router.post(Signup.path, CommonApiController.signup);

router.post(GetProfile.path, verifyJWT([Roles.ADMIN, Roles.USER]), CommonApiController.getProfile);

router.put(UpdateProfile.path, verifyJWT([Roles.ADMIN, Roles.USER]), CommonApiController.updateProfile);

router.post(GetNotifications.path, verifyJWT([Roles.ADMIN, Roles.USER]), CommonApiController.getNotifications);

router.post(MarkAllNotificationsRead.path, verifyJWT([Roles.ADMIN, Roles.USER]), CommonApiController.markallnotificationsread);

export default router;