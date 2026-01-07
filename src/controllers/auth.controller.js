import * as authService from "../services/auth.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const getMeta = (req) => ({
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});

export const registerUserController = async (req, res) => {
  const data = await authService.register(req.body, getMeta(req));
  res.cookie("refreshToken", data.refreshToken, cookieOptions);
  res.status(201).json({ user: data.user, accessToken: data.accessToken });
};

export const loginUserController = async (req, res) => {
  const data = await authService.login(req.body, getMeta(req));
  res.cookie("refreshToken", data.refreshToken, cookieOptions);
  res.json({ user: data.user, accessToken: data.accessToken });
};

export const refreshTokenController = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  const data = await authService.refresh(token, getMeta(req));
  res.cookie("refreshToken", data.refreshToken, cookieOptions);
  res.json({ accessToken: data.accessToken });
};

export const logoutController = async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const logoutAllController = async (req, res) => {
  await authService.logoutAll(req.user._id);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out from all devices" });
};
