import RefreshSession from "../models/refreshSession.js";

export const getSessionsController = async (req, res) => {
  const sessions = await RefreshSession.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .select("-refreshTokenHash");

  res.json(sessions);
};

export const revokeSessionController = async (req, res) => {
  const session = await RefreshSession.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({ message: "Session revoked" });
};
