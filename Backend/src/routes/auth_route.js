const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/auth_controller");
const { registerValidator } = require("../validators/auth_validators");
const { validateRequest } = require("../middlewares/validate.middleware");


router.post("/onboarding", registerValidator, validateRequest, registerUser);

module.exports = router;
