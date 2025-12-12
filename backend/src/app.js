import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import orderRoutes from "./routes/order.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import sendOTPRoutes from "./routes/opt.routes.js";
import transactionRoutes from "./routes/Transaction.routes.js";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";

const app = express();

// DB connection
connectDB();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", orderRoutes);
app.use("/api/v1/", complaintRoutes);
app.use("/api/v2/", bankRoutes);
app.use("/api/v3/", sendOTPRoutes);
app.use("/api/v4/", transactionRoutes);

// Export
export default app;
