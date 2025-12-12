import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    firebaseUid: {
      type: String,
      default: null,
      index: true,
    },

    userType: {
      type: String,
      enum: ["user", "admin", "merchant", "support"],
      default: "user",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    complaints: [{ type: Schema.Types.ObjectId, ref: "Complaint" }],
    bankDetails: [{ type: Schema.Types.ObjectId, ref: "BankDetails" }],
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return;
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (err) {
    console.log("Error in the registering the User ", err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", UserSchema);

export default User;
