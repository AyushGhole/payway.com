import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    complaint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
