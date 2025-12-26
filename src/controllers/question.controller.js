import Question from "../models/question.js";

export const getQuestions = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const questions = await Question.find(
      categoryId ? { categoryId } : {}
    ).populate("answers.userId", "firstName lastName");
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
