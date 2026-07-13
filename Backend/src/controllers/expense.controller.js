const Expense = require("../models/Expense");

/**
 * Add a new expense
 */
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, paymentMethod, type, date } = req.body;

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      description,
      paymentMethod,
      type,
      date,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get all expenses of the authenticated user
 */
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get a single expense by ID
 */
const getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Error fetching single expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update an existing expense
 */
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, description, paymentMethod, type, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, category, description, paymentMethod, type, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete an expense
 */
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get spending velocity and projected month-end forecast
 */
const getExpenseForecast = async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    // Start and end of the current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Fetch all current-month transactions (both income and expense)
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let spentSoFar = 0;
    let incomeSoFar = 0;

    expenses.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0;
      if (tx.type === "income") {
        incomeSoFar += amt;
      } else {
        spentSoFar += amt;
      }
    });

    const elapsedDays = today.getDate();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const remainingDays = totalDays - elapsedDays;

    const dailyRate = elapsedDays > 0 ? (spentSoFar / elapsedDays) : 0;
    const projectedRemaining = dailyRate * remainingDays;
    const forecastedExpenses = spentSoFar + projectedRemaining;

    res.status(200).json({
      success: true,
      data: {
        spentSoFar,
        incomeSoFar,
        dailyRate,
        elapsedDays,
        remainingDays,
        totalDays,
        projectedRemaining,
        forecastedExpenses
      }
    });
  } catch (error) {
    console.error("Error in getExpenseForecast:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Get Pocket Money Allowance metrics for students
 */
const getPocketMoneyAllowance = async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Start & end of the current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Start & end of today (local time boundary)
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Fetch month-to-date expenses
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let spentThisMonth = 0;
    let spentToday = 0;
    const todayExpensesList = [];

    expenses.forEach(tx => {
      if (tx.type === "expense") {
        const amt = parseFloat(tx.amount) || 0;
        spentThisMonth += amt;

        // Check if transaction is today
        const txDate = new Date(tx.date);
        if (txDate >= startOfToday && txDate <= endOfToday) {
          spentToday += amt;
          todayExpensesList.push({
            id: tx._id,
            title: tx.title,
            amount: amt,
            category: tx.category,
            paymentMethod: tx.paymentMethod,
            date: tx.date
          });
        }
      }
    });

    const elapsedDays = today.getDate();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const remainingDays = totalDays - elapsedDays + 1; // Includes today

    res.status(200).json({
      success: true,
      data: {
        spentThisMonth,
        spentToday,
        elapsedDays,
        remainingDays,
        totalDays,
        todayExpenses: todayExpensesList
      }
    });
  } catch (error) {
    console.error("Error in getPocketMoneyAllowance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  getExpenseForecast,
  getPocketMoneyAllowance,
};


