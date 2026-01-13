import * as authService from "../services/auth.js";

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

const getMeta = (req) => ({
  ip: req.ip,
  userAgent: req.headers["user-agent"] || "unknown",
});

const setAuthCookies = (res, refreshToken, csrfToken) => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("csrfToken", csrfToken, csrfCookieOptions);
};

const clearAuthCookies = (res) => {
  res.clearCookie("refreshToken", { path: "/" });
  res.clearCookie("csrfToken", { path: "/" });
};

export const registerUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, csrfToken } =
      await authService.register(req.body, getMeta(req));
    setAuthCookies(res, refreshToken, csrfToken);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    if (err.message === "USER_EXISTS")
      return res.status(400).json({ message: "User already exists" });
    next(err);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, csrfToken } =
      await authService.login(req.body, getMeta(req));
    setAuthCookies(res, refreshToken, csrfToken);
    res.json({ user, accessToken });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS")
      return res.status(401).json({ message: "Invalid email or password" });
    next(err);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "NO_REFRESH_TOKEN" });
    }

    const data = await authService.refresh(refreshToken, getMeta(req));
    if (!data) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "INVALID_SESSION" });
    }

    setAuthCookies(res, data.refreshToken, data.csrfToken);
    res.json({ accessToken: data.accessToken });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res) => {
  try {
    if (req.cookies?.refreshToken)
      await authService.logout(req.cookies.refreshToken);
  } finally {
    clearAuthCookies(res);
    res.json({ message: "Logged out" });
  }
};

export const logoutAllController = async (req, res) => {
  await authService.logoutAll(req.user._id);
  clearAuthCookies(res);
  res.json({ message: "Logged out from all devices" });
};

export const meController = async (req, res) => {
  res.json({ user: req.user });
};
