import express from "express";
import {
  createTransaction,
  getLatestTransactions,
} from "../controllers/Transaction.controllers.js";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/transaction
router.post("/:id/transaction", createTransaction);
router.get("/:userId/getTransaction", getLatestTransactions);

// Razorpay Test Route
router.post("/create-order", createOrder);

export default router;
