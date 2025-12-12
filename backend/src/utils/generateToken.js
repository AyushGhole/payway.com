// backend/src/utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateAccessTokens = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  return jwt.sign(payload, secret, { expiresIn });
};
