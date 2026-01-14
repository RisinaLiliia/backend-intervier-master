import RefreshSession from "../models/refreshSession.js";
import { generateCsrfToken, hashCsrfToken } from "../utils/csrf.js";

export const getCsrfToken = async (req, res) => {
  try {
    if (!req.user?.sessionId)
      return res.status(401).json({ message: "UNAUTHORIZED" });

    const csrfToken = generateCsrfToken();

    await RefreshSession.findByIdAndUpdate(req.user.sessionId, {
      csrfHash: hashCsrfToken(csrfToken),
    });

    res.json({ csrfToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "CSRF_FETCH_FAILED" });
  }
};
