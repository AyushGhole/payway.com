// routes/bank.routes.js
import express from "express";
import {
  addBankAndCard,
  getBankDetails,
} from "../controllers/bank.controller.js";

const router = express.Router();

// POST /api/bank/:userId/add
router.post("/:id/add_bank_and_card", addBankAndCard);
router.get("/:id/get_bank_details", getBankDetails);

export default router;
