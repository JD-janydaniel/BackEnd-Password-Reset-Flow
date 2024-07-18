import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
} from "../Controller/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { resetAuthMiddleware } from "../Middleware/resetAuthMiddleware.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/get-user", authMiddleware, getUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetAuthMiddleware, resetPassword);

export default router;
