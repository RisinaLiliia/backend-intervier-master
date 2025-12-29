import express from "express";
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);

export default router;
