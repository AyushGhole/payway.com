// backend/routes/otp.routes.js
import express from "express";
import {
  sendOTPEmailController,
  verifyOTPController,
} from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/send-otp", sendOTPEmailController);
router.post("/verify-otp", verifyOTPController);

export default router;
