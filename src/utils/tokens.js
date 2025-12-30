import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

export const generateRefreshToken = () =>
  crypto.randomBytes(64).toString("hex");
