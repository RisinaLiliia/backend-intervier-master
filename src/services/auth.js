import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const register = async ({ firstName, lastName, email, password }) => {
  const exists = await User.exists({ email });
  if (exists) throw new Error("USER_EXISTS");

  const user = await User.create({ firstName, lastName, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refresh = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("INVALID_REFRESH");

  const accessToken = generateAccessToken(user._id);
  return { accessToken };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
};
