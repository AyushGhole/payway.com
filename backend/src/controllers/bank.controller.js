import User from "../models/User.model.js";
import BankDetails from "../models/bank.model.js";

export const addBankAndCard = async (req, res) => {
  const id = req.params.id;
  console.log("Received userId:", id);
  console.log("Received body:", req.body);
  const {
    BankName,
    IFSC,
    Branch,
    cardHolder,
    cardNumber,
    expiry,
    cvv,
    amount,
    currUser,
  } = req.body;

  console.log("Received data:", req.body);

  try {
    const user = await User.findById(currUser);
    if (!user) {
      console.log("User not found:", currUser);
      return res.status(404).json({ message: "User not found" });
    }

    const bankDoc = await BankDetails.create({
      BankName,
      IFSC,
      Branch,
      cardHolder,
      cardNumber,
      expiry,
      cvv,
      amount, // <-- store amount
    });

    console.log("BankDetails saved:", bankDoc);

    user.bankDetails.push(bankDoc._id);
    await user.save();

    console.log("BankDetails linked to user:", currUser);

    res
      .status(200)
      .json({ message: "Bank + Card + Amount added successfully", bankDoc });
  } catch (err) {
    console.error("Error saving bank/card info:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBankDetails = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching bank details for userId:", id);

    // Find user and populate bankDetails
    const user = await User.findById(id).populate("bankDetails");
    if (!user) {
      console.log("User not found:", id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Bank details fetched:", user.bankDetails);
    return res.status(200).json({ bankDetails: user.bankDetails });
  } catch (err) {
    console.error("Error fetching bank details:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
