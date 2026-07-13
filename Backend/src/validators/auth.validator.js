const { body } = require("express-validator");

/**
 * Validation rules for user login requests.
 */
const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  loginValidator,
};
