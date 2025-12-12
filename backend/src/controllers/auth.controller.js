// backend/src/controllers/auth.controller.js
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { generateAccessTokens } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password, firebaseUid } = req.body;

    if (!email || (!password && !firebaseUid)) {
      return res
        .status(400)
        .json({ message: "Email and password (or firebaseUid) required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = new User({
      username,
      email,
      password: password || undefined,
      firebaseUid: firebaseUid || null,
    });

    await user.save();

    const token = generateAccessTokens({
      id: user._id,
      email: user.email,
      userType: user.userType,
    });

    return res.status(200).json({
      message: "User registered",
      user: user.toJSON(),
      token,
      email,
      username,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, email, password, firebaseUid } = req.body;

    if (!email && !firebaseUid) {
      return res.status(400).json({ message: "Email or firebaseUid required" });
    }

    let user;
    if (firebaseUid) {
      user = await User.findOne({ firebaseUid });
      if (!user)
        return res
          .status(404)
          .json({ message: "User not found for provided firebaseUid" });
    } else {
      user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAccessTokens({
      id: user._id,
      email: user.email,
      userType: user.userType,
      email,
      username,
    });

    // return user without password
    const safeUser = await User.findById(user._id);

    return res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token,
      email,
      username,
    });
  } catch (err) {
    next(err);
  }
};

// update userType and other profile fields (used after frontend collects userType)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { userType, organizationId, username } = req.body;

    const update = {};
    if (userType) update.userType = userType;
    if (organizationId) update.organizationId = organizationId;
    if (username) update.username = username;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    return res.json({ message: "Profile updated", user });
  } catch (err) {
    console.log("Updation Of User error : ", err);
  }
};
