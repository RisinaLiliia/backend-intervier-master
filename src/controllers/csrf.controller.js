import RefreshSession from "../models/refreshSession.js";
import { generateCsrfToken, hashCsrfToken } from "../utils/csrf.js";

const csrfCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const getCsrfToken = async (req, res) => {
  const csrfToken = generateCsrfToken();

  await RefreshSession.findByIdAndUpdate(req.user.sessionId, {
    csrfHash: hashCsrfToken(csrfToken),
  });

  res.cookie("csrfToken", csrfToken, csrfCookieOptions);
  res.json({ csrfToken });
};
