import Question from "../models/question.js";

export const getQuestions = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const userId = req.user?._id?.toString();

    const filter = categoryId ? { categoryId } : {};
    const questions = await Question.find(filter).lean();

    const result = questions.map((q) => {
      const userAnswer = q.answers.find((a) => a.userId?.toString() === userId);
      const defaultAnswer = q.answers.find((a) => !a.userId);

      return {
        ...q,
        displayedAnswer: userAnswer || defaultAnswer || null,
        defaultAnswer: defaultAnswer || null,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const upsertUserAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body;
    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: "Answer is required" });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user._id.toString();

    let userAnswer = question.answers.find(
      (a) => a.userId?.toString() === userId
    );

    if (userAnswer) {
      userAnswer.text = answer.trim();
      userAnswer.updatedAt = new Date();
    } else {
      question.answers.push({ userId, text: answer.trim() });
      userAnswer = question.answers.at(-1);
    }

    await question.save();

    res.json({
      _id: userAnswer._id,
      text: userAnswer.text,
      updatedAt: userAnswer.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user._id.toString();
    const userAnswer = question.answers.find(
      (a) => a.userId?.toString() === userId
    );

    if (!userAnswer) {
      return res.status(404).json({ message: "User answer not found" });
    }

    question.answers.id(userAnswer._id).deleteOne();
    await question.save();

    res.json({ message: "User answer deleted" });
  } catch (err) {
    next(err);
  }
};
