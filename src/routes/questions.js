import express from "express";
import { protect } from "../middleware/auth.js";
import { csrfProtect } from "../middleware/csrf.js";
import {
  getQuestions,
  upsertUserAnswer,
  deleteUserAnswer,
} from "../controllers/question.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getQuestions);
router.post("/:questionId", csrfProtect, upsertUserAnswer);
router.delete("/:questionId", csrfProtect, deleteUserAnswer);

export default router;
