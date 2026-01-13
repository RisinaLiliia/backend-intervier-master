import User from "../models/user.js";
import RefreshSession from "../models/refreshSession.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { hashToken } from "../utils/hash.js";
import { generateCsrfToken, hashCsrfToken } from "../utils/csrf.js";
import jwt from "jsonwebtoken";

const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;

const createSession = async (user, meta) => {
  const csrfToken = generateCsrfToken();

  const session = await RefreshSession.create({
    userId: user._id,
    refreshTokenHash: "PENDING",
    csrfHash: hashCsrfToken(csrfToken),
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: new Date(Date.now() + REFRESH_TTL),
  });
  const refreshToken = generateRefreshToken({
    sessionId: session._id.toString(),
  });

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return {
    user,
    accessToken: generateAccessToken(user._id, session._id.toString()),
    refreshToken,
    csrfToken,
    sessionId: session._id,
  };
};

export const register = async (data, meta) => {
  if (await User.exists({ email: data.email })) throw new Error("USER_EXISTS");

  const user = await User.create(data);
  return createSession(user, meta);
};

export const login = async ({ email, password }, meta) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    throw new Error("INVALID_CREDENTIALS");

  return createSession(user, meta);
};

export const refresh = async (token, meta) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const tokenHash = hashToken(token);

    const oldSession = await RefreshSession.findOne({
      _id: payload.sessionId,
      refreshTokenHash: tokenHash,
    });

    if (!oldSession || oldSession.expiresAt < new Date()) {
      if (oldSession) await oldSession.deleteOne();
      return null;
    }

    await oldSession.deleteOne();

    const user = await User.findById(oldSession.userId);
    if (!user) return null;

    return createSession(user, meta);
  } catch {
    return null;
  }
};

export const logout = async (token) => {
  try {
    const { sessionId } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await RefreshSession.findByIdAndDelete(sessionId);
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
