import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (sessionId) =>
  jwt.sign({ sessionId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
