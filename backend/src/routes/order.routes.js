import express from "express";

const router = express.Router();

import { createOrder, getUserOrders } from "../controllers/order.controller.js";

// Create Order
router.post("/:id/details", createOrder);

// Get all orders of a user
router.get("/:id/orders", getUserOrders);

const orderRoutes = router;

export default orderRoutes;
