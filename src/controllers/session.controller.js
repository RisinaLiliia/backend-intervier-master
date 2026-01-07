import * as authService from "../services/auth.js";
import RefreshSession from "../models/refreshSession.js";

export const getSessionsController = async (req, res) => {
  const sessions = await RefreshSession.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .select("-refreshTokenHash");

  res.json(sessions);
};

export const revokeSessionController = async (req, res) => {
  try {
    const sessionId = req.params.id;
    await authService.revokeSession(sessionId, req.user._id);
    res.json({ message: "Session revoked" });
  } catch (err) {
    if (err.message === "SESSION_NOT_FOUND") {
      return res.status(404).json({ message: "Session not found" });
    }
    if (err.message === "FORBIDDEN") {
      return res
        .status(403)
        .json({ message: "Not allowed to revoke this session" });
    }
    res.status(500).json({ message: "Failed to revoke session" });
  }
};
