import * as authService from "../services/auth.js";

export const registerUserController = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Invalid credentials" });
  }
};
