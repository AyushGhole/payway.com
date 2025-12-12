import Order from "../models/Order.model.js";
import User from "../models/User.model.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    console.log("Incoming Order Body:", req.body); // 👈 ADD THIS
    const { name, email, product, address } = req.body;
    const userId = req.params.id;

    if (!name || !email || !product || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(user);

    // Save new order
    const newOrder = new Order({
      name,
      email,
      product,
      address,
      user: userId,
    });

    const newOrders = await newOrder.save();

    console.log(newOrders._id);

    // Add reference inside user model
    user.orders.push(newOrders._id);
    await user.save();

    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (err) {
    console.log("Order Error:", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// Get orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (err) {
    console.log("Fetch Orders Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
