import express from "express";
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  logoutController,
  logoutAllController,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { protect } from "../middleware/auth.js";
import { meController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authLimiter, registerUserController);
router.post("/login", authLimiter, loginUserController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);
router.post("/logout-all", protect, logoutAllController);
router.get("/me", protect, meController);

export default router;
