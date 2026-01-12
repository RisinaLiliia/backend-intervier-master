import Question from "../models/question.js";

export const getQuestions = async (req, res) => {
  const { categoryId } = req.query;
  const userId = req.user?._id;

  try {
    const questions = await Question.find(
      categoryId ? { categoryId } : {}
    ).populate("answers.userId", "firstName lastName");

    const result = questions.map((q) => {
      const userAnswer = q.answers.find(
        (a) => a.userId?.toString() === userId?.toString()
      );
      const defaultAnswer = q.answers.find((a) => !a.userId);

      return {
        ...q.toObject(),
        displayedAnswer: userAnswer || defaultAnswer || { text: "" },
        defaultAnswer: defaultAnswer || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Добавление/обновление ответа пользователя
export const upsertUserAnswer = async (req, res) => {
  const { answer } = req.body;
  if (!answer?.trim())
    return res.status(400).json({ message: "Answer is required" });

  const question = await Question.findById(req.params.questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const userId = req.user._id.toString();

  let userAnswer = question.answers.find(
    (a) => a.userId?.toString() === userId
  );

  if (userAnswer) {
    userAnswer.text = answer;
    userAnswer.updatedAt = new Date();
  } else {
    question.answers.push({ userId, text: answer });
    userAnswer = question.answers.at(-1);
  }

  await question.save();

  res.json({ _id: userAnswer._id, text: userAnswer.text });
};

// Удаление ответа пользователя
export const deleteUserAnswer = async (req, res) => {
  const question = await Question.findById(req.params.questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const userId = req.user._id.toString();
  const userAnswer = question.answers.find(
    (a) => a.userId?.toString() === userId
  );

  if (!userAnswer)
    return res.status(404).json({ message: "User answer not found" });

  question.answers.id(userAnswer._id).deleteOne();
  await question.save();

  res.json({ message: "User answer deleted" });
};
