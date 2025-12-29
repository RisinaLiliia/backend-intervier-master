import * as authService from "../services/auth.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUserController = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({ user, accessToken });
  } catch {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const data = await authService.refresh(token);
    res.json(data);
  } catch {
    res.status(403).json({ message: "Refresh token expired" });
  }
};

export const logoutController = async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
