import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, sessionId) => {
  return jwt.sign({ userId, sessionId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = ({ sessionId }) =>
  jwt.sign({ sessionId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
