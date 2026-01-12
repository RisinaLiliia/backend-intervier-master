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
  userAgent: req.headers["user-agent"] || "unknown",
});

export const registerUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
      getMeta(req)
    );
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    next(err);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
      getMeta(req)
    );
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({ user, accessToken });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    next(err);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "NO_REFRESH_TOKEN" });

    const data = await authService.refresh(token, getMeta(req));
    if (!data) {
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "INVALID_SESSION" });
    }

    res.cookie("refreshToken", data.refreshToken, cookieOptions);
    res.json({ accessToken: data.accessToken });
  } catch (err) {
    next(err);
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
  res.json({ message: "Logged out from all devices" });
};

export const meController = (req, res) => {
  res.json(req.user);
};
