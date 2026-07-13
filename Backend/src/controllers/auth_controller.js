const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

/**
 * Register a new user onboarding
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists (Standard query)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    // Generate a token for the new user using standard utility
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000) for race conditions
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Login an existing user
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
