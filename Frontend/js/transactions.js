document.addEventListener("DOMContentLoaded", () => {
  // Check auth token
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  // --- STATE ---
  let transactions = [];
  let currentPage = 1;
  const pageSize = 10;
  let filteredTransactions = [];

  // --- API CONFIG ---
  const API_URL = `${CONFIG.API_BASE_URL}/api/v1/expenses`;

  // --- ELEMENT SELECTORS ---
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const userInitial = document.getElementById("userInitial");
  const logoutBtn = document.getElementById("logoutBtn");

  // Filtering
  const detailedSearchTx = document.getElementById("detailedSearchTx");
  const detailedFilterType = document.getElementById("detailedFilterType");
  const detailedFilterCategory = document.getElementById("detailedFilterCategory");
  const detailedFilterPayment = document.getElementById("detailedFilterPayment");
  const detailedTxTableBody = document.getElementById("detailedTxTableBody");

  // Pagination
  const detailedPrevPageBtn = document.getElementById("detailedPrevPageBtn");
  const detailedNextPageBtn = document.getElementById("detailedNextPageBtn");
  const detailedPaginationText = document.getElementById("detailedPaginationText");

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
        window.location.href = "/login.html";
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
          type: e.type || ((e.category === "Salary" || e.category === "Investment") ? "income" : "expense")
        }));
        applyFilters();
      } else {
        showToast("Error", data.message || "Failed to load expenses.", "error");
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    }
  };

  // --- FILTERS & TRANSACTIONS TABLE ---
  const populateCategoryFilters = () => {
    const categories = [
      "Food", "Transportation", "Shopping", "Bills", "Healthcare", 
      "Entertainment", "Education", "Travel", "Salary", "Investment", "Other"
    ];
    detailedFilterCategory.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      detailedFilterCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
  };

  const applyFilters = () => {
    const searchVal = detailedSearchTx.value.toLowerCase();
    const typeVal = detailedFilterType.value;
    const catVal = detailedFilterCategory.value;
    const payVal = detailedFilterPayment.value;

    filteredTransactions = transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(searchVal);
      const matchType = typeVal === "all" || tx.type === typeVal;
      const matchCategory = catVal === "all" || tx.category === catVal;
      const matchPayment = payVal === "all" || tx.paymentMethod === payVal;
      return matchSearch && matchType && matchCategory && matchPayment;
    });

    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    currentPage = 1;
    renderTransactionsTable();
  };

  const renderTransactionsTable = () => {
    detailedTxTableBody.innerHTML = "";

    if (filteredTransactions.length === 0) {
      detailedTxTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <i class="ph ph-receipt-x empty-state-icon"></i>
            <h3>No transactions found</h3>
            <p>Add a new transaction or refine your filter parameters.</p>
          </td>
        </tr>
      `;
      detailedPaginationText.innerText = "Showing 0-0 of 0";
      detailedPrevPageBtn.disabled = true;
      detailedNextPageBtn.disabled = true;
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
        <td>${tx.paymentMethod}</td>
        <td>
          <span class="tx-amount ${tx.type === 'income' ? 'income' : 'expense'}">
            ${tx.type === 'income' ? '+' : '-'}₹${tx.amount.toFixed(2)}
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

      detailedTxTableBody.appendChild(row);
    });

    detailedPaginationText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${filteredTransactions.length}`;
    detailedPrevPageBtn.disabled = currentPage === 1;
    detailedNextPageBtn.disabled = endIndex === filteredTransactions.length;

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
      type,
      date,
      description: desc
    };

    try {
      let response;
      if (id) {
        response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
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
  detailedSearchTx.addEventListener("input", applyFilters);
  detailedFilterType.addEventListener("change", applyFilters);
  detailedFilterCategory.addEventListener("change", applyFilters);
  detailedFilterPayment.addEventListener("change", applyFilters);

  detailedPrevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTransactionsTable();
    }
  });

  detailedNextPageBtn.addEventListener("click", () => {
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
    window.location.href = "/login.html";
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

  // Run initializer
  init();
});
