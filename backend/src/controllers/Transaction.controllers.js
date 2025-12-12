import User from "../models/User.model.js";
import BankDetails from "../models/bank.model.js";
import Transaction from "../models/Transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "UserId and amount are required." });
    }

    // 1️⃣ Fetch user
    const user = await User.findById(userId).populate("bankDetails");
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.bankDetails || user.bankDetails.length === 0) {
      return res.status(400).json({ message: "Bank details not found." });
    }

    // 2️⃣ Use first bank account (you can adjust logic if multiple)
    const bank = await BankDetails.findById(user.bankDetails[0]);
    if (!bank)
      return res.status(404).json({ message: "Bank account not found." });

    // 3️⃣ Check balance
    if (amount > bank.amount) {
      // Transaction failed
      const failedTransaction = await Transaction.create({
        user: user._id,
        bank: bank._id,
        amount,
        status: "failed",
      });
      return res
        .status(400)
        .json({ message: "Insufficient funds.", failedTransaction });
    }

    // 4️⃣ Deduct amount
    bank.amount -= amount;
    await bank.save();

    // 5️⃣ Store transaction
    const transaction = await Transaction.create({
      user: user._id,
      bank: bank._id,
      amount,
      status: "success",
    });

    // 6️⃣ Push transaction to user.transactions
    user.transactions.push(transaction._id);
    await user.save();
    console.log(bank);
    console.log(user);
    console.log(transaction);

    // 7️⃣ Return latest 3 transactions
    const latestTransactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      message: "Transaction successful.",
      transaction,
      latestTransactions,
    });
  } catch (err) {
    console.error("Transaction Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get the latestTransaction
export const getLatestTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(userId);

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // 1️⃣ Fetch user with populated transactions
    const user = await User.findById(userId).populate({
      path: "transactions",
      options: { sort: { transactionDate: -1 }, limit: 3 },
    });

    console.log("User modal", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Format data for frontend UI
    const formatted = user.transactions.map((t) => ({
      AccountHolderName: user.username || "You",
      Amount: t.amount,
      Status: t.status,
      Date: t.transactionDate,
      _id: t._id,
    }));

    return res.status(200).json({
      message: "Latest transactions fetched successfully",
      latestTransactions: formatted,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      message: "Server error fetching transactions",
    });
  }
};
