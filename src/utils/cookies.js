const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const csrfCookieOptions = {
  httpOnly: false,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

export const setAuthCookies = (res, refreshToken, csrfToken, accessToken) => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("csrfToken", csrfToken, csrfCookieOptions);
  res.cookie("accessToken", accessToken, accessCookieOptions);
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.clearCookie("csrfToken", { path: "/" });
};
