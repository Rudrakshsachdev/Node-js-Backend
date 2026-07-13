const { body } = require("express-validator");

const expenseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("amount")
    .trim()
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a numeric value")
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error("Amount must be a positive number");
      }
      return true;
    }),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Food",
      "Transportation",
      "Shopping",
      "Bills",
      "Healthcare",
      "Entertainment",
      "Education",
      "Travel",
      "Salary",
      "Investment",
      "Other"
    ])
    .withMessage("Invalid category type"),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn([
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking",
      "Wallet"
    ])
    .withMessage("Invalid payment method"),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format, must be YYYY-MM-DD"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Invalid transaction type"),
];

module.exports = {
  expenseValidator,
};
