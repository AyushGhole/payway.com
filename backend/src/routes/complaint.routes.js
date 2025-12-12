import express from "express";
import {
  createComplaint,
  getUserComplaints,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/:id/complaint", createComplaint);
router.get("/:id/complaints", getUserComplaints);

export default router;
