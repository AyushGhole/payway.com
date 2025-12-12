// backend/src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);

    // attach minimal user info
    req.user = {
      id: payload.id,
      email: payload.email,
      userType: payload.userType,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
