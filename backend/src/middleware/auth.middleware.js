import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const authenticate = async (req, res, next) => {
  // console.log("Cookies in request:", req.cookies); // Debugging cookies
  const authHeader = req.headers.authorization;
  // console.log("Authorization header:", req.headers.authorization);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }
  // const tokenId = req.cookies["__secure_rt"];
  const tokenId = authHeader.split(" ")[1];
  // console.log("token id: ", tokenId);
  // if (!tokenId) {
  //   // console.log("Unauthorized");
  //   return res.status(401).json({ error: "Unauthorized: No token provided." });
  // }

  try {
    const decoded = jwt.verify(tokenId, process.env.JWT_ACCESS_SECRET);
    // console.log("decoded: ", decoded);

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token: Missing userId." });
    }

    const user = await User.findById(decoded.userId).select("personal_info");

    if (!user) {
      return res
        .status(401)
        .json({ error: "User not found, Authorization denied." });
    }

    req.user = user;

    // console.log("req.user: ", req.user);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, error: "Token expired. Please log in again." });
    }
    res.status(401).json({ error: "Not authorized, invalid token." });
  }
};

export const authenticateOptional = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue as guest
    return next();
  }

  const tokenId = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenId, process.env.JWT_ACCESS_SECRET);

    if (!decoded.userId) {
      // Invalid token payload, just continue as guest
      return next();
    }

    const user = await User.findById(decoded.userId).select("personal_info");

    if (!user) {
      // User not found, continue as guest
      return next();
    }

    req.user = user; // attach user if found and valid token
    next();
  } catch (err) {
    // If token expired or invalid, just continue as guest
    next();
  }
};
