const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const { sendEmail } = require("../services/emailService");

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

/**
 * Forgot password - generates secure OTP and sends it
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    // Generic response to prevent email enumeration attacks
    const genericResponse = {
      success: true,
      message: "If an account with this email exists, an OTP has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Rate Limiting: enforce 60-second delay between OTP requests per user
    const now = new Date();
    if (user.lastOtpRequestedAt && (now - user.lastOtpRequestedAt < 60000)) {
      const waitTime = Math.ceil((60000 - (now - user.lastOtpRequestedAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitTime} seconds before requesting another OTP.`,
      });
    }

    // Generate random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP details to user
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    user.lastOtpRequestedAt = now;
    await user.save();

    // Send standard OTP email
    await sendEmail({
      to: user.email,
      subject: "ExpenseTracker - Password Reset OTP",
      text: `Your password reset One-Time Password (OTP) is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">ExpenseTracker</h2>
          <p>Hello ${user.name || 'User'},</p>
          <p>We received a request to reset your password. Use the following One-Time Password (OTP) to continue:</p>
          <div style="background: #f4f4f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 6px; color: #18181b; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #71717a; line-height: 1.4;">This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Verify OTP code and return a temporary password reset token
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    // Check failed attempts (brute force protection)
    if (user.otpAttempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Check expiration
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Verify OTP value hash
    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedInput !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();

      const attemptsLeft = 5 - user.otpAttempts;
      return res.status(400).json({
        success: false,
        message: attemptsLeft > 0 
          ? `Invalid OTP. You have ${attemptsLeft} attempts remaining.`
          : "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Generate short-lived reset token (expires in 10 minutes)
    const resetToken = jwt.sign(
      { email: user.email, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Invalidate OTP immediately to prevent reuse
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Error in verifyOtp controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Reset password using temporary reset token
 */
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Verify token purpose
    if (decoded.purpose !== "reset-password") {
      return res.status(400).json({
        success: false,
        message: "Invalid token purpose.",
      });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate reset parameters
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
