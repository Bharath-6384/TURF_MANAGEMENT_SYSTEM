import { Request, Response } from 'express';
import logger, { controllerExecutingLog } from '../utils/logger';
import * as CommonApiService from '../services/common-service';
import { ForgotPassword, VerifyPasswordOtp, ResetPassword, GetProfile, UpdateProfile, Signup, GetNotifications, MarkAllNotificationsRead } from '../models/common-interface';

const CLASS_NAME = 'CommonApiController';

export const forgotPassword = async (req: Request<{}, {}, ForgotPassword.Request>, res: Response) => {
  const API_NAME = ForgotPassword.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.forgotPassword(req, res);
};

export const verifyPasswordOtp = async (req: Request<{}, {}, VerifyPasswordOtp.Request>,res: Response) => {
  const API_NAME = VerifyPasswordOtp.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.verifyPasswordOtp(req, res);
};

export const resetPassword = async (req: Request<{}, {}, ResetPassword.Request>, res: Response) => {
const API_NAME = ResetPassword.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.resetPassword(req, res);
};

export const getProfile = async (req: Request, res: Response) => {
const API_NAME = GetProfile.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.getProfile(req, res);
};

export const updateProfile = async (req: Request, res: Response) => {
  const API_NAME = UpdateProfile.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.updateProfile(req, res);
};

export const signup = async (req: Request<{}, {}, Signup.Request>, res: Response) => {
  const API_NAME = Signup.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return CommonApiService.signup(req, res);
};


export const getNotifications = async (req: Request<{}, {}, GetNotifications.Request>, res: Response) => {
  const API_NAME = GetNotifications.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  await CommonApiService.getNotifications(req, res);
};

export const markallnotificationsread = async (req: Request<{}, {}, MarkAllNotificationsRead.Request>, res: Response) => {
  const API_NAME = MarkAllNotificationsRead.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  await CommonApiService.markAllNotificationsRead(req, res);
};
