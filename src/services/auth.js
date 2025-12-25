import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const register = async ({ firstName, lastName, email, password }) => {
  const exists = await User.exists({ email });
  if (exists) throw new Error("USER_EXISTS");

  const user = await User.create({ firstName, lastName, email, password });

  return {
    user,
    accessToken: generateToken(user._id),
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user,
    accessToken: generateToken(user._id),
  };
};
