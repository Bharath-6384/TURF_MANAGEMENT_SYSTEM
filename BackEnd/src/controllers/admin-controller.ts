import {Request, Response} from 'express'
import logger, { controllerExecutingLog } from '../utils/logger'
import * as AdminService from '../services/admin-service'
import { RegisterTurf, GetAllTurfs, GetAllBookings, GetAllPayments, GetAllUsers, AdminDashboard, UpdateBooking, UpdateTurf, DeleteTurf, UpdateUser } from '../models/admin-interface'

const CLASS_NAME = 'AdminController'

export const registerTurf = async(req:Request, res:Response) => {
    const API_NAME = RegisterTurf.path;
    logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

    return await AdminService.registerTurf(req,res);
}

export const getAllTurfs = async (req: Request, res: Response) => {
  const API_NAME = GetAllTurfs.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return AdminService.getAllTurfs(req, res);
};

export const getAllBookings = async (req: Request, res: Response) => {
  const API_NAME = GetAllBookings.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return AdminService.getAllBookings(req, res);
};

export const getAllPayments = async (req: Request, res: Response) => {
  const API_NAME = GetAllPayments.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return AdminService.getAllPayments(req, res);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const API_NAME = GetAllUsers.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return AdminService.getAllUsers(req, res);
};

export const adminDashboard = async (req: Request<AdminDashboard.Request>, res: Response) => {
  const API_NAME = AdminDashboard.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return await AdminService.adminDashboard(req, res);
};

export const updateBooking = async (req: Request<UpdateBooking.Params, {}, UpdateBooking.Request>, res: Response) => {
  const API_NAME = UpdateBooking.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return await AdminService.updateBooking(req, res);
};

export const updateTurf = async (req: Request,res: Response) => {
  const API_NAME = UpdateTurf.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return await AdminService.updateTurf(req, res);
};

export const deleteTurf = async (req: Request<DeleteTurf.Params>, res: Response) => {
  const API_NAME = DeleteTurf.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return await AdminService.deleteTurf(req, res);
};

export const updateUser = async (req: Request<UpdateUser.Params, {}, UpdateUser.Request>, res: Response) => {
  const API_NAME = UpdateUser.path;
  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

  return await AdminService.updateUser(req, res);
};