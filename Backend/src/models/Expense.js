const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
  },
  description: {
    type: String,
    trim: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking",
      "Wallet"
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"],
    default: "expense"
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true,
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
