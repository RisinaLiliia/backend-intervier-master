import jwt from "jsonwebtoken";
import User from "../models/user.js";
import RefreshSession from "../models/refreshSession.js";
import { generateAccessToken } from "../utils/tokens.js";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.[ACCESS_COOKIE];

    if (accessToken) {
      try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(payload.userId).select("-password");
        if (!user) return res.status(401).json({ message: "USER_NOT_FOUND" });

        req.user = user;
        req.user.sessionId = payload.sessionId;
        return next();
      } catch (err) {
        if (err.name !== "TokenExpiredError") {
          return res.status(401).json({ message: "ACCESS_TOKEN_INVALID" });
        }
      }
    }

    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) return res.status(401).json({ message: "NO_TOKENS" });

    let refreshPayload;
    try {
      refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "REFRESH_TOKEN_INVALID" });
    }

    const session = await RefreshSession.findById(refreshPayload.sessionId);
    if (!session || session.expiresAt < new Date()) {
      if (session) await session.deleteOne();
      return res.status(401).json({ message: "SESSION_EXPIRED" });
    }

    const user = await User.findById(session.userId).select("-password");
    if (!user) return res.status(401).json({ message: "USER_NOT_FOUND" });

    const newAccessToken = generateAccessToken(
      user._id,
      session._id.toString()
    );

    res.cookie(ACCESS_COOKIE, newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    req.user = user;
    req.currentSessionId = session._id.toString();
    req.user.sessionId = session._id.toString();

    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    res.status(401).json({ message: "UNAUTHORIZED" });
  }
};
