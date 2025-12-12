import { razorpayInstance } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // ₹500 → 50000 paisa
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
