import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getQuestions,
  upsertUserAnswer,
  deleteUserAnswer,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/", getQuestions);

router.post("/:questionId", protect, upsertUserAnswer);
router.delete("/:questionId", protect, deleteUserAnswer);

export default router;
