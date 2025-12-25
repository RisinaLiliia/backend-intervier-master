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

export const addAnswer = async (req, res) => {
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ message: "Answer is required" });
  }

  const question = await Question.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        answers: {
          userId: req.user._id,
          text: answer,
        },
      },
    },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(question);
};

export const updateAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    question.answers.push({ userId: req.user._id, text: req.body.answer });
    await question.save();
    res.json(question);
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
