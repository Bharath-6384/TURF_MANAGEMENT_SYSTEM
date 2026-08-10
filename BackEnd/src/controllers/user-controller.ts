import {Request, Response} from 'express'
import logger, { controllerExecutingLog } from '../utils/logger'
import * as UserService from '../services/user-service'
import { BookTurf, UserDashboard, GetSlot, GetAllTurfs, GetUserBookings } from '../models/user-interface'

const CLASS_NAME = 'AdminController'

export const registerTurf = async(req:Request, res:Response) => {
    const API_NAME = BookTurf.path;
    logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

    return await UserService.bookTurf(req,res);
};

export const userDashboard = async (req: Request<UserDashboard.Request>, res: Response) => {
    const API_NAME = UserDashboard.path;
    logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

    return await UserService.userDashboard(req, res);
};

export const getSlot = async (req:Request<GetSlot.Request>, res:Response) => {
    const API_NAME = GetSlot.path;
    logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

    return await UserService.getslot(req, res);
};

export const getAllTurfs = async (req: Request, res: Response) => {
  const API_NAME = GetAllTurfs.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return UserService.getAllTurfs(req, res);
};

export const getUserBookings = async (req: Request<GetUserBookings.Request>, res: Response) => {
  const API_NAME = GetUserBookings.path;

  logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));
  return UserService.getUserBookings(req, res);
};