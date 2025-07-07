import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/config.js";
import { redis } from "../lib/redis.js";

// function to generate access and refresh tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// function to store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7
  ); // Store for 7 days
};

// function to set cookies for access and refresh tokens
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevent client-side access
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevent client-side access
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// SIGNUP USER AND CREATE ACCESS AND REFRESH TOKEN
export const signup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // Destructure the request body
  const { name, email, password, role } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists! Please login.",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // save the user in the database
    await newUser.save({ session });

    const { accessToken, refreshToken } = generateTokens(newUser._id); // Generate tokens
    await storeRefreshToken(newUser._id, refreshToken); // Store refresh token in Redis

    // set cookies in the response
    setCookies(res, accessToken, refreshToken);

    // commit the transaction
    await session.commitTransaction();
    session.endSession();

    // send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        ...newUser._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    // abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    console.error("Error during signup:", error);
    throw error;
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate the required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please signup.",
      });
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate access and refresh tokens again
    const { accessToken, refreshToken } = generateTokens(existingUser._id);
    await storeRefreshToken(existingUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    // send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...existingUser._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

// LOGOUT and clear cookies
export const logout = async (req, res) => {
  try {
    // Get the refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    // Check if refresh token is provided
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); // Verify the refresh token
      await redis.del(`refreshToken:${decoded.userId}`); // Delete the old refresh token from Redis
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("Cookie_1");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    // Get the refresh token from cookies (7day lived)
    const refreshToken = req.cookies.refreshToken;

    // Check if refresh token is provided
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // get the stored refresh token from Redis with the user ID decoded from the refresh token
    const storeToken = await redis.get(`refreshToken:${decoded.userId}`);

    // Check if the stored token matches the provided refresh token
    if (storeToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Set the new access token in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Optionally, you can generate a new refresh token and store it
    res.json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({
      message: "Error during token refresh",
      error: error.message,
    });
  }
};

// GET PROFILE OF THE LOGGED IN USER
export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // req.user is the user object that is attached to the request by the protectRoute middleware
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
