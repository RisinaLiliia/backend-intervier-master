import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
