import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import categoryRoutes from "./routes/categories.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

export default app;
