import { initIncomeExpenseChart } from './charts/incomeExpenseChart.js';
import { initCategoryDistributionChart } from './charts/categoryDistributionChart.js';
import { initSavingsTrendChart } from './charts/savingsTrendChart.js';
import { initPaymentMethodChart } from './charts/paymentMethodChart.js';
import { initTopSpendingChart } from './charts/topSpendingChart.js';

document.addEventListener("DOMContentLoaded", () => {
  // Check auth token
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/auth/login";
    return;
  }

  // --- STATE ---
  let transactions = [];
  let charts = {};

  // --- API CONFIG ---
  const API_URL = `${CONFIG.API_BASE_URL}/api/v1/expenses`;

  // --- ELEMENT SELECTORS ---
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const userInitial = document.getElementById("userInitial");
  const logoutBtn = document.getElementById("logoutBtn");

  const analyticBalance = document.getElementById("analyticBalance");
  const analyticSavingsRate = document.getElementById("analyticSavingsRate");
  const analyticAvgExpense = document.getElementById("analyticAvgExpense");
  const analyticTopCategory = document.getElementById("analyticTopCategory");

  // --- INITIALIZATION ---
  const init = async () => {
    // Load User Profile info
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      profileName.innerText = user.name || "User";
      profileEmail.innerText = user.email || "user@example.com";
      userInitial.innerText = (user.name || "U")[0].toUpperCase();
    }

    await fetchExpenses();
  };

  // --- API CALLS ---
  const fetchExpenses = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        // Map backend Expense fields
        transactions = data.expenses.map(e => ({
          id: e._id,
          description: e.title,
          amount: parseFloat(e.amount),
          category: e.category,
          paymentMethod: e.paymentMethod,
          date: e.date.split("T")[0],
          type: e.type || ((e.category === "Salary" || e.category === "Investment") ? "income" : "expense")
        }));
        updateDashboard();
      } else {
        showToast("Error", data.message || "Failed to load expenses.", "error");
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    }
  };

  // --- STATISTICS CALCULATIONS ---
  const updateDashboard = () => {
    calculateKPIs();
    renderAllCharts();
  };

  const calculateKPIs = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};
    const monthlyExpenses = {};

    transactions.forEach(tx => {
      const monthKey = tx.date.substring(0, 7); // e.g., "2026-07"
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        // Group by category
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
        // Group by month
        monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + tx.amount;
      }
    });

    const netSavings = totalIncome - totalExpense;
    
    // 1. Net Savings Balance
    analyticBalance.innerText = `₹${netSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // 2. Savings Rate (Savings / Income * 100)
    let savingsRateVal = 0;
    if (totalIncome > 0) {
      savingsRateVal = Math.max(0, (netSavings / totalIncome) * 100);
    }
    analyticSavingsRate.innerText = `${savingsRateVal.toFixed(1)}%`;

    // 3. Average Monthly Expenses
    const activeMonths = Object.keys(monthlyExpenses).length;
    const avgExpenseVal = activeMonths > 0 ? (totalExpense / activeMonths) : totalExpense;
    analyticAvgExpense.innerText = `₹${avgExpenseVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // 4. Highest Category
    let topCategoryName = "-";
    let maxExpense = 0;
    Object.entries(categoryExpenses).forEach(([cat, val]) => {
      if (val > maxExpense) {
        maxExpense = val;
        topCategoryName = cat;
      }
    });
    analyticTopCategory.innerText = topCategoryName;
  };

  // --- CHART RENDERING ---
  const renderAllCharts = () => {
    // Destroy existing instances if refreshing
    Object.keys(charts).forEach(key => {
      if (charts[key]) charts[key].destroy();
    });

    charts.incomeExpense = initIncomeExpenseChart("incomeExpenseChartNode", transactions);
    charts.category = initCategoryDistributionChart("categoryDistributionChartNode", transactions);
    charts.savings = initSavingsTrendChart("savingsTrendChartNode", transactions);
    charts.payment = initPaymentMethodChart("paymentMethodChartNode", transactions);
    charts.topSpending = initTopSpendingChart("topSpendingChartNode", transactions);
  };

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  });

  // Toast System
  const showToast = (title, message, type = "success") => {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const iconClass = type === "success" ? "ph ph-check-circle" : "ph ph-warning-circle";

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };

  // Mobile menu & backdrop toggle
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  const openSidebar = () => {
    if (sidebarMenu) sidebarMenu.classList.add("active");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
  };

  const closeSidebar = () => {
    if (sidebarMenu) sidebarMenu.classList.remove("active");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
  };

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebarMenu && sidebarMenu.classList.contains("active")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebar);
  }

  init();
});
