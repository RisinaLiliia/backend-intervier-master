import * as authService from "../services/auth.js";
import RefreshSession from "../models/refreshSession.js";
import mongoose from "mongoose";
import { generateCsrfToken, hashCsrfToken } from "../utils/csrf.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const csrfCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const setCsrfCookie = (res) => {
  const csrfToken = generateCsrfToken();
  res.cookie("csrfToken", csrfToken, csrfCookieOptions);
  return csrfToken;
};

export const getSessionsController = async (req, res, next) => {
  try {
    const sessions = await RefreshSession.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("_id ip userAgent createdAt updatedAt expiresAt");

    const result = sessions.map((s) => {
      const isCurrent = s._id.toString() === req.sessionId;

      return {
        _id: s._id,
        ip: s.ip,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        expiresAt: s.expiresAt,
        csrfToken: isCurrent ? setCsrfCookie(res) : undefined,
        current: isCurrent,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const revokeSessionController = async (req, res, next) => {
  try {
    const { id: sessionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid session id" });

    await authService.revokeSession(sessionId, req.user._id);

    if (sessionId === req.sessionId) {
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("csrfToken", { path: "/" });
    }

    res.json({ message: "Session revoked" });
  } catch (err) {
    if (err.message === "SESSION_NOT_FOUND")
      return res.status(404).json({ message: "Session not found" });
    if (err.message === "FORBIDDEN")
      return res
        .status(403)
        .json({ message: "Not allowed to revoke this session" });
    next(err);
  }
};
