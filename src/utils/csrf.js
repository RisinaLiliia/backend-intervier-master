import crypto from "crypto";

export const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");
export const hashCsrfToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
