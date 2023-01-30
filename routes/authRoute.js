import express from 'express';
import { userLogin, refreshTokenUser, userLogout } from '../controllers/authController.js';

const router = express.Router();

router.post("/login", userLogin);

router.post("/refresh", refreshTokenUser);

router.delete("/logout", userLogout);

export default router