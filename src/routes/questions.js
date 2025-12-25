import express from "express";
import {
  getQuestions,
  updateAnswer,
  deleteQuestion,
} from "../controllers/question.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getQuestions);
router.patch("/:id", protect, updateAnswer);
router.delete("/:id", protect, deleteQuestion);

export default router;
