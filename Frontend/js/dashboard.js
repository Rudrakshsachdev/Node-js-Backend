document.addEventListener("DOMContentLoaded", () => {
  // Check auth token
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // --- STATE ---
  let transactions = [];
  let budgets = [
    { category: "Food", spent: 0, limit: 400 },
    { category: "Transportation", spent: 0, limit: 200 },
    { category: "Shopping", spent: 0, limit: 300 },
    { category: "Bills", spent: 0, limit: 500 },
    { category: "Healthcare", spent: 0, limit: 150 },
    { category: "Entertainment", spent: 0, limit: 150 },
    { category: "Education", spent: 0, limit: 250 },
    { category: "Travel", spent: 0, limit: 600 },
    { category: "Other", spent: 0, limit: 200 }
  ];
  let goals = [
    { name: "New Laptop", current: 800, target: 1200 },
    { name: "Emergency Fund", current: 3000, target: 5000 },
    { name: "Vacation", current: 450, target: 1500 }
  ];
  let alerts = [];

  // Pagination / Filter / Search State
  let currentPage = 1;
  const pageSize = 5;
  let filteredTransactions = [];
  let financialChartInstance = null;
  let categoryChartInstance = null;

  // --- API CONFIG ---
  const API_URL = "http://localhost:3000/api/v1/expenses";

  // --- ELEMENT SELECTORS ---
  const greetingText = document.getElementById("greetingText");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const userInitial = document.getElementById("userInitial");
  const logoutBtn = document.getElementById("logoutBtn");

  const kpiBalance = document.getElementById("kpiBalance");
  const kpiIncome = document.getElementById("kpiIncome");
  const kpiExpense = document.getElementById("kpiExpense");
  const kpiBudget = document.getElementById("kpiBudget");

  const searchTx = document.getElementById("searchTx");
  const filterType = document.getElementById("filterType");
  const filterCategory = document.getElementById("filterCategory");
  const txTableBody = document.getElementById("txTableBody");

  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const paginationText = document.getElementById("paginationText");

  const budgetWidgetList = document.getElementById("budgetWidgetList");
  const goalsWidgetList = document.getElementById("goalsWidgetList");
  const notificationsPanel = document.getElementById("notificationsPanel");

  // Modal elements
  const txModal = document.getElementById("txModal");
  const openTransactionModalBtn = document.getElementById("openTransactionModalBtn");
  const closeTxModalBtn = document.getElementById("closeTxModalBtn");
  const cancelTxModalBtn = document.getElementById("cancelTxModalBtn");
  const txForm = document.getElementById("txForm");
  const txModalTitle = document.getElementById("txModalTitle");

  // Form Inputs
  const txIdInput = document.getElementById("txId");
  const txDescriptionInput = document.getElementById("txDescription");
  const txAmountInput = document.getElementById("txAmount");
  const txTypeInput = document.getElementById("txType");
  const txCategoryInput = document.getElementById("txCategory");
  const txPaymentMethodInput = document.getElementById("txPaymentMethod");
  const txDateInput = document.getElementById("txDate");

  // Action buttons
  const exportReportBtn = document.getElementById("exportReportBtn");

  // --- INITIALIZATION ---
  const init = async () => {
    // Load User Profile info from storage
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      profileName.innerText = user.name || "User";
      profileEmail.innerText = user.email || "user@example.com";
      userInitial.innerText = (user.name || "U")[0].toUpperCase();
      greetingText.innerText = `Welcome back, ${user.name || "User"}`;
    }

    populateCategoryFilters();
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
        // Session expired or invalid
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        // Map backend Expense fields to local variables
        transactions = data.expenses.map(e => ({
          id: e._id,
          description: e.title,
          amount: parseFloat(e.amount),
          category: e.category,
          paymentMethod: e.paymentMethod,
          date: e.date.split("T")[0],
          // Dynamically compute type based on category
          type: (e.category === "Salary" || e.category === "Investment") ? "income" : "expense"
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

  // --- DYNAMIC RENDERING ---
  const updateDashboard = () => {
    calculateKPIs();
    renderCharts();
    applyFilters();
    renderBudgets();
    renderGoals();
    renderNotifications();
  };

  const calculateKPIs = () => {
    let balance = 0;
    let income = 0;
    let expense = 0;
    let budgetTotalLimit = 0;
    let budgetSpent = 0;

    transactions.forEach(tx => {
      const amt = tx.amount || 0;
      if (tx.type === "income") {
        income += amt;
      } else {
        expense += amt;
      }
    });

    balance = income - expense;

    // Reset budget spent
    budgets.forEach(b => {
      b.spent = 0;
      budgetTotalLimit += b.limit;
    });

    // Reset alerts
    alerts = [];

    transactions.forEach(tx => {
      if (tx.type === "expense") {
        const amt = tx.amount || 0;
        const b = budgets.find(b => b.category.toLowerCase() === tx.category.toLowerCase());
        if (b) {
          b.spent += amt;
          budgetSpent += amt;
        }
      }
    });

    // Check budget thresholds for notifications
    budgets.forEach(b => {
      if (b.spent > b.limit) {
        alerts.push({
          type: "danger",
          message: `Overspent! You exceeded your ${b.category} budget by $${(b.spent - b.limit).toFixed(0)}.`,
          time: "Just now"
        });
      } else if (b.spent >= b.limit * 0.85) {
        alerts.push({
          type: "warning",
          message: `Warning: You spent ${Math.round((b.spent / b.limit) * 100)}% of your ${b.category} budget.`,
          time: "Just now"
        });
      }
    });

    const budgetRemaining = Math.max(0, budgetTotalLimit - budgetSpent);

    // Format fields
    kpiBalance.innerText = `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiIncome.innerText = `$${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiExpense.innerText = `$${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiBudget.innerText = `$${budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- CHARTS ---
  const renderCharts = () => {
    // 1. Category Chart (Expenses Distribution)
    const categoryTotals = {};
    transactions.forEach(tx => {
      if (tx.type === "expense") {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + (tx.amount || 0);
      }
    });

    const categories = Object.keys(categoryTotals);
    const categoryValues = Object.values(categoryTotals);

    if (categoryChartInstance) {
      categoryChartInstance.destroy();
    }

    const ctxCategory = document.getElementById("categoryChart").getContext("2d");
    categoryChartInstance = new Chart(ctxCategory, {
      type: "doughnut",
      data: {
        labels: categories.length ? categories : ["No Expenses"],
        datasets: [{
          data: categoryValues.length ? categoryValues : [1],
          backgroundColor: ["#059669", "#ef4444", "#3b82f6", "#eab308", "#6366f1", "#ec4899", "#8b5cf6", "#f43f5e", "#71717a"],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 10 } } }
        }
      }
    });

    // 2. Financial Chart (Daily Income vs Expense Trend)
    const datesSet = new Set(transactions.map(tx => tx.date));
    const sortedDates = Array.from(datesSet).sort().slice(-7);

    const incomeTrend = sortedDates.map(date => {
      return transactions
        .filter(tx => tx.date === date && tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
    });

    const expenseTrend = sortedDates.map(date => {
      return transactions
        .filter(tx => tx.date === date && tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
    });

    if (financialChartInstance) {
      financialChartInstance.destroy();
    }

    const ctxFinancial = document.getElementById("financialChart").getContext("2d");
    financialChartInstance = new Chart(ctxFinancial, {
      type: "line",
      data: {
        labels: sortedDates.length ? sortedDates : ["No Data"],
        datasets: [
          {
            label: "Income",
            data: incomeTrend.length ? incomeTrend : [0],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            fill: true,
            tension: 0.3
          },
          {
            label: "Expenses",
            data: expenseTrend.length ? expenseTrend : [0],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { borderDash: [4, 4] } },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12 } }
        }
      }
    });
  };

  // --- FILTERS & TRANSACTIONS TABLE ---
  const populateCategoryFilters = () => {
    const categories = [
      "Food", "Transportation", "Shopping", "Bills", "Healthcare", 
      "Entertainment", "Education", "Travel", "Salary", "Investment", "Other"
    ];
    filterCategory.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      filterCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
  };

  const applyFilters = () => {
    const searchVal = searchTx.value.toLowerCase();
    const typeVal = filterType.value;
    const catVal = filterCategory.value;

    filteredTransactions = transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(searchVal);
      const matchType = typeVal === "all" || tx.type === typeVal;
      const matchCategory = catVal === "all" || tx.category === catVal;
      return matchSearch && matchType && matchCategory;
    });

    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    currentPage = 1;
    renderTransactionsTable();
  };

  const renderTransactionsTable = () => {
    txTableBody.innerHTML = "";

    if (filteredTransactions.length === 0) {
      txTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <i class="ph ph-receipt-x empty-state-icon"></i>
            <h3>No transactions found</h3>
            <p>Add a new transaction or refine your filter parameters.</p>
          </td>
        </tr>
      `;
      paginationText.innerText = "Showing 0-0 of 0";
      prevPageBtn.disabled = true;
      nextPageBtn.disabled = true;
      return;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredTransactions.length);
    const paginatedTx = filteredTransactions.slice(startIndex, endIndex);

    paginatedTx.forEach(tx => {
      const icon = getCategoryIcon(tx.category);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div class="tx-info">
            <div class="tx-category-icon" style="background: ${tx.type === 'income' ? 'var(--income-light)' : 'var(--expense-light)'}; color: ${tx.type === 'income' ? 'var(--income-color)' : 'var(--expense-color)'};">
              <i class="${icon}"></i>
            </div>
            <div class="tx-details">
              <span class="tx-title">${tx.description}</span>
              <span class="tx-meta">${tx.category} • ${tx.paymentMethod}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}">${tx.category}</span>
        </td>
        <td>
          <span class="tx-amount ${tx.type === 'income' ? 'income' : 'expense'}">
            ${tx.type === 'income' ? '+' : '-'}$${tx.amount.toFixed(2)}
          </span>
        </td>
        <td>${tx.date}</td>
        <td>
          <div class="tx-actions">
            <button class="action-btn edit-btn" data-id="${tx.id}" title="Edit"><i class="ph ph-pencil"></i></button>
            <button class="action-btn delete delete-btn" data-id="${tx.id}" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      `;

      txTableBody.appendChild(row);
    });

    paginationText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${filteredTransactions.length}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex === filteredTransactions.length;

    // Attach Event Listeners to actions
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditModal(btn.getAttribute("data-id")));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteTransaction(btn.getAttribute("data-id")));
    });
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "food": return "ph ph-cookie";
      case "transportation": return "ph ph-car";
      case "shopping": return "ph ph-shopping-bag";
      case "bills": return "ph ph-lightning";
      case "healthcare": return "ph ph-first-aid";
      case "entertainment": return "ph ph-game-controller";
      case "education": return "ph ph-student";
      case "travel": return "ph ph-airplane";
      case "salary": return "ph ph-briefcase";
      case "investment": return "ph ph-chart-line-up";
      default: return "ph ph-tag";
    }
  };

  // --- BUDGETS & GOALS WIDGETS ---
  const renderBudgets = () => {
    budgetWidgetList.innerHTML = "";
    budgets.forEach(b => {
      const percent = Math.min(100, Math.round((b.spent / b.limit) * 100));
      let fillClass = "";
      if (percent >= 90) fillClass = "danger";
      else if (percent >= 70) fillClass = "warning";

      budgetWidgetList.innerHTML += `
        <div class="budget-item">
          <div class="budget-header">
            <span>${b.category}</span>
            <span>$${b.spent.toFixed(0)} / $${b.limit}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-fill ${fillClass}" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    });
  };

  const renderGoals = () => {
    goalsWidgetList.innerHTML = "";
    goals.forEach(g => {
      const percent = Math.min(100, Math.round((g.current / g.target) * 100));
      goalsWidgetList.innerHTML += `
        <div class="goal-item">
          <div class="goal-header">
            <span>${g.name}</span>
            <span>$${g.current} / $${g.target} (${percent}%)</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    });
  };

  const renderNotifications = () => {
    notificationsPanel.innerHTML = "";
    if (alerts.length === 0) {
      notificationsPanel.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">No active alerts.</p>`;
      return;
    }
    alerts.forEach(a => {
      const icon = a.type === "warning" ? "ph ph-warning-circle warning" : "ph ph-info danger";
      notificationsPanel.innerHTML += `
        <div class="notification-item">
          <i class="${icon} notification-icon"></i>
          <div class="notification-details">
            <p>${a.message}</p>
            <span class="notification-time">${a.time}</span>
          </div>
        </div>
      `;
    });
  };

  // --- CRUD API BINDINGS ---
  const openEditModal = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    txIdInput.value = tx.id;
    txDescriptionInput.value = tx.description;
    txAmountInput.value = tx.amount;
    txTypeInput.value = tx.type;
    txCategoryInput.value = tx.category;
    txPaymentMethodInput.value = tx.paymentMethod;
    txDateInput.value = tx.date;

    txModalTitle.innerText = "Edit Transaction";
    txModal.classList.add("active");
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showToast("Deleted", "Transaction deleted successfully.", "success");
        await fetchExpenses();
      } else {
        showToast("Delete Failed", data.message || "Could not delete transaction.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    }
  };

  txForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Client Validation
    const desc = txDescriptionInput.value.trim();
    const amt = parseFloat(txAmountInput.value);
    const type = txTypeInput.value;
    const cat = txCategoryInput.value;
    const paymentMethod = txPaymentMethodInput.value;
    const date = txDateInput.value;

    let isValid = true;

    if (!desc) {
      showInputError(txDescriptionInput, "Description is required");
      isValid = false;
    }
    if (isNaN(amt) || amt <= 0) {
      showInputError(txAmountInput, "Amount must be greater than 0");
      isValid = false;
    }
    if (!date) {
      showInputError(txDateInput, "Date is required");
      isValid = false;
    }

    if (!isValid) return;

    const id = txIdInput.value;
    const payload = {
      title: desc,
      amount: amt,
      category: cat,
      paymentMethod,
      date,
      description: desc // Fallback duplicate for schema
    };

    try {
      let response;
      if (id) {
        // Edit PUT API
        response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create POST API
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        showToast("Success", id ? "Transaction updated successfully." : "Transaction added successfully.", "success");
        txModal.classList.remove("active");
        txForm.reset();
        await fetchExpenses();
      } else {
        showToast("Error", data.message || "Failed to save transaction.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    }
  });

  const showInputError = (input, message) => {
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (errorSpan) {
      errorSpan.innerText = message;
      errorSpan.classList.add("visible");
    }
  };

  // Clear errors on input
  [txDescriptionInput, txAmountInput, txDateInput].forEach(input => {
    input.addEventListener("input", () => {
      const errorSpan = document.getElementById(`${input.id}Error`);
      if (errorSpan) {
        errorSpan.classList.remove("visible");
        errorSpan.innerText = "";
      }
    });
  });

  // --- TOOLBAR & EVENT BINDINGS ---
  searchTx.addEventListener("input", applyFilters);
  filterType.addEventListener("change", applyFilters);
  filterCategory.addEventListener("change", applyFilters);

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTransactionsTable();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const startIndex = currentPage * pageSize;
    if (startIndex < filteredTransactions.length) {
      currentPage++;
      renderTransactionsTable();
    }
  });

  // Modal controls
  openTransactionModalBtn.addEventListener("click", () => {
    txIdInput.value = "";
    txForm.reset();
    txDateInput.value = new Date().toISOString().split("T")[0]; // default to today
    txModalTitle.innerText = "Add Transaction";
    txModal.classList.add("active");
  });

  const closeModal = () => {
    txModal.classList.remove("active");
    txForm.reset();
  };
  closeTxModalBtn.addEventListener("click", closeModal);
  cancelTxModalBtn.addEventListener("click", closeModal);

  // Export report
  exportReportBtn.addEventListener("click", () => {
    if (transactions.length === 0) {
      showToast("Export Failed", "No data to export.", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Description,Amount,Category,PaymentMethod,Date\n";
    transactions.forEach(t => {
      csvContent += `"${t.id}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.category}","${t.paymentMethod}","${t.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expensetracker_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported", "Report downloaded successfully.", "success");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
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

  // Run initializer
  init();
});
