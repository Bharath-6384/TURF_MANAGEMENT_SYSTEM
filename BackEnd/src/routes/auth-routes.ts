import { Router } from "express";
import * as AuthController from '../controllers/auth-controller'
import { Login } from '../models/auth-interface'

const router = Router();

router.post(Login.path, AuthController.login);

export default router;