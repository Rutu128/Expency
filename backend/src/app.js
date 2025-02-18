import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "./cron.js"
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "UPDATE", "PUT"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Routes
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import insightRoutes from "./routes/insight.routes.js";

app.use("/auth", authRoutes);

app.use("/transactions", transactionRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/insight", insightRoutes);

export default app;
