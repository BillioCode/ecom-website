import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ACCESS_TOKEN_SECRET } from "../config/config.js";

// Middleware to protect routes by verifying access token and setting req.user to the request object
export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get the access token from cookies
    const accessToken = req.cookies.accessToken;

    // 2. Verify the access token exists in cookies
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    // 3. Verify the access token
    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

      // 4. find the user associated with the access token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5. Set req.user to the user object
      req.user = user;

      // 6. Call the next middleware
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
