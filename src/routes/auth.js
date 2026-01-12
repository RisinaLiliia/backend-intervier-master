import express from "express";
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  logoutController,
  logoutAllController,
  meController,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { protect } from "../middleware/auth.js";
import { getCsrfToken } from "../controllers/csrf.controller.js";

const router = express.Router();

router.post("/register", authLimiter, registerUserController);
router.post("/login", authLimiter, loginUserController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);

router.get("/me", protect, meController);
router.post("/logout-all", protect, logoutAllController);
router.get("/csrf", protect, getCsrfToken);

export default router;
