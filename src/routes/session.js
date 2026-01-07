import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getSessionsController,
  revokeSessionController,
} from "../controllers/session.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getSessionsController);
router.delete("/:id", revokeSessionController);

export default router;
