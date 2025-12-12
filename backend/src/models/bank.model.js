import mongoose from "mongoose";
const { Schema } = mongoose;

const BankDetailsSchema = new Schema({
  BankName: { type: String, required: true },
  IFSC: { type: String, required: true },
  Branch: { type: String, required: true },
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
  amount: { type: Number, required: true }, // <-- amount added
});

const BankDetails = mongoose.model("BankDetails", BankDetailsSchema);
export default BankDetails;
