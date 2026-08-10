import {Request, Response} from 'express'
import logger, { controllerExecutingLog } from '../utils/logger'
import * as AuthService from '../services/auth-service'

const CLASS_NAME = 'AuthController'

export const login = async(req:Request, res:Response) => {
    const API_NAME = "/login";
    logger.info(controllerExecutingLog(CLASS_NAME, API_NAME));

    return await AuthService.login(req,res);
}

