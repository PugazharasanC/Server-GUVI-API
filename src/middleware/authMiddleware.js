import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verifies token and attaches user to request
export const protect = async (req, res, next) => {

  // Get token from cookies or authorization header
  let token = req.cookies.jwt;

  // If no token in cookies, check authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
