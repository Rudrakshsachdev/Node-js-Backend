const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth_controller");
const { registerValidator } = require("../validators/auth_validators");
const { loginValidator } = require("../validators/auth.validator");
const { validateRequest } = require("../middlewares/validate.middleware");

// Routes
router.post("/onboarding", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

module.exports = router;
