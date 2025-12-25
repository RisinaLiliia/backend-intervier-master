import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  answers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Question", QuestionSchema);
