const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword 
} = require("../controllers/auth_controller");
const { registerValidator } = require("../validators/auth_validators");
const { loginValidator } = require("../validators/auth.validator");
const { 
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator 
} = require("../validators/password.validator");
const { validateRequest } = require("../middlewares/validate.middleware");

// Routes
router.post("/onboarding", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

// Password recovery routes
router.post("/forgot-password", forgotPasswordValidator, validateRequest, forgotPassword);
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);
router.post("/reset-password", resetPasswordValidator, validateRequest, resetPassword);

module.exports = router;
