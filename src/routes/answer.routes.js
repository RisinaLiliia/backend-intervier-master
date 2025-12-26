import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addAnswer,
  updateAnswer,
  deleteAnswer,
} from "../controllers/answer.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/:questionId", protect, addAnswer);
router.patch("/:questionId/:answerId", protect, updateAnswer);
router.delete("/:questionId/:answerId", protect, deleteAnswer);

export default router;
