import RefreshSession from "../models/refreshSession.js";
import { hashCsrfToken } from "../utils/csrf.js";

export const csrfProtect = async (req, res, next) => {
  try {
    const csrfHeader = req.headers["x-csrf-token"];
    const sessionId = req.user?.sessionId;

    if (!csrfHeader || !sessionId) {
      return res.status(403).json({ message: "CSRF_MISSING" });
    }

    const session = await RefreshSession.findById(sessionId);
    if (!session)
      return res.status(403).json({ message: "CSRF_SESSION_INVALID" });

    if (session.csrfHash !== hashCsrfToken(csrfHeader)) {
      return res.status(403).json({ message: "CSRF_INVALID" });
    }

    next();
  } catch (err) {
    next(err);
  }
};
