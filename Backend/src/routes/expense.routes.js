const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const { expenseValidator } = require("../validators/expense.validator");
const { validateRequest } = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication middleware to all expense routes
router.use(authMiddleware);

// Routes
router.post("/", expenseValidator, validateRequest, addExpense);
router.get("/", getAllExpenses);
router.get("/:id", getSingleExpense);
router.put("/:id", expenseValidator, validateRequest, updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
