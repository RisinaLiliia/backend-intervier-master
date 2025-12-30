import * as authService from "../services/auth.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const getMeta = (req) => ({
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});

export const registerUserController = async (req, res) => {
  try {
    const data = await authService.register(req.body, getMeta(req));
    res.cookie("refreshToken", data.refreshToken, cookieOptions);
    res.status(201).json({ user: data.user, accessToken: data.accessToken });
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const data = await authService.login(req.body, getMeta(req));
    res.cookie("refreshToken", data.refreshToken, cookieOptions);
    res.json({ user: data.user, accessToken: data.accessToken });
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

    const data = await authService.refresh(token, getMeta(req));
    res.cookie("refreshToken", data.refreshToken, cookieOptions);
    res.json({ accessToken: data.accessToken });
  } catch {
    res.clearCookie("refreshToken");
    res.status(403).json({ message: "Refresh failed" });
  }
};

export const logoutController = async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const logoutAllController = async (req, res) => {
  await authService.logoutAll(req.user._id);

  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out from all devices",
  });
};
