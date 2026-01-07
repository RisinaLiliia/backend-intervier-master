import User from "../models/user.js";
import RefreshSession from "../models/refreshSession.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { hashToken } from "../utils/hash.js";
import jwt from "jsonwebtoken";

const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;

export const register = async (data, meta) => {
  const exists = await User.exists({ email: data.email });
  if (exists) throw new Error("USER_EXISTS");

  const user = await User.create(data);
  return createSession(user, meta);
};

export const login = async ({ email, password }, meta) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return createSession(user, meta);
};

const createSession = async (user, { ip, userAgent }) => {
  const session = await RefreshSession.create({
    userId: user._id,
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + REFRESH_TTL),
  });

  const refreshToken = generateRefreshToken(session._id);
  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return {
    user,
    accessToken: generateAccessToken(user._id),
    refreshToken,
  };
};

export const refresh = async (token, meta) => {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const tokenHash = hashToken(token);

  const session = await RefreshSession.findOne({
    _id: payload.sessionId,
    refreshTokenHash: tokenHash,
  });

  if (!session) throw new Error("INVALID_SESSION");

  await session.deleteOne();

  const user = await User.findById(session.userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  return createSession(user, meta);
};

export const logout = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await RefreshSession.findByIdAndDelete(payload.sessionId);
  } catch {}
};

export const logoutAll = async (userId) => {
  await RefreshSession.deleteMany({ userId });
};

export const revokeSession = async (sessionId, userId) => {
  const session = await RefreshSession.findById(sessionId);
  if (!session) throw new Error("SESSION_NOT_FOUND");
  if (session.userId.toString() !== userId.toString())
    throw new Error("FORBIDDEN");

  await session.deleteOne();
};
