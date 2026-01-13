import express from "express";
import { protect } from "../middleware/auth.js";
import { csrfProtect } from "../middleware/csrf.js";
import {
  getQuestions,
  upsertUserAnswer,
  deleteUserAnswer,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/", getQuestions);

router.post("/:questionId", protect, csrfProtect, upsertUserAnswer);
router.delete("/:questionId", protect, csrfProtect, deleteUserAnswer);

export default router;
