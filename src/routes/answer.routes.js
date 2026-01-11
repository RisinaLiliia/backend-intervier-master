import express from "express";
import { protect } from "../middleware/auth.js";
import {
  upsertUserAnswer,
  deleteUserAnswer,
} from "../controllers/answer.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/:questionId", protect, upsertUserAnswer);

router.delete("/:questionId", protect, deleteUserAnswer);

export default router;
