import Question from "../models/question.js";

export const addAnswer = async (req, res) => {
  const { answer } = req.body;
  if (!answer) return res.status(400).json({ message: "Answer is required" });

  const question = await Question.findById(req.params.questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  question.answers.push({ userId: req.user._id, text: answer });
  await question.save();
  res.json(question);
};

export const updateAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const answer = question.answers.id(answerId);
  if (!answer) return res.status(404).json({ message: "Answer not found" });
  if (answer.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Access denied" });

  answer.text = req.body.answer;
  answer.updatedAt = Date.now();
  await question.save();

  res.json(question);
};

export const deleteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const answer = question.answers.id(answerId);
  if (!answer) return res.status(404).json({ message: "Answer not found" });
  if (answer.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Access denied" });

  answer.deleteOne();
  await question.save();

  res.json({ message: "Answer deleted successfully" });
};
