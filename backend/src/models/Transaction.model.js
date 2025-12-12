import mongoose from "mongoose";
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bank: { type: Schema.Types.ObjectId, ref: "BankDetails", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
