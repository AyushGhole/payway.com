import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import sendOTPRoutes from "./routes/opt.routes.js";
import transactionRoutes from "./routes/Transaction.routes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://payway-r2pg.onrender.com"
];

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Preflight support
app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", orderRoutes);
app.use("/api/v1/", complaintRoutes);
app.use("/api/v2/", bankRoutes);
app.use("/api/v3/", sendOTPRoutes);
app.use("/api/v4/", transactionRoutes);

export default app;
