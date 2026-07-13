document.addEventListener("DOMContentLoaded", () => {
  // Check auth token
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/auth/login";
    return;
  }

  // --- STATE ---
  let allowanceState = null;
  let overallBudget = parseFloat(localStorage.getItem("overallBudget")) || 5000;

  // --- SELECTORS ---
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const userInitial = document.getElementById("userInitial");
  const logoutBtn = document.getElementById("logoutBtn");

  // KPI elements
  const kpiTodaySafe = document.getElementById("kpiTodaySafe");
  const kpiTodaySafeFooter = document.getElementById("kpiTodaySafeFooter");
  const cardTodaySafe = document.getElementById("cardTodaySafe");
  const kpiTodaySpent = document.getElementById("kpiTodaySpent");
  const kpiMonthLimit = document.getElementById("kpiMonthLimit");
  const kpiMonthSpent = document.getElementById("kpiMonthSpent");
  const kpiDaysRemaining = document.getElementById("kpiDaysRemaining");
  const kpiTotalDays = document.getElementById("kpiTotalDays");

  // List elements
  const todayTxList = document.getElementById("todayTxList");
  const todayTxCount = document.getElementById("todayTxCount");

  // Pacing elements
  const pacingBadge = document.getElementById("pacingBadge");
  const pacingAdvice = document.getElementById("pacingAdvice");

  // Math Summary elements
  const mathBudget = document.getElementById("mathBudget");
  const mathSpent = document.getElementById("mathSpent");
  const mathRemaining = document.getElementById("mathRemaining");
  const mathDailyStart = document.getElementById("mathDailyStart");

  const API_URL = "http://localhost:3000/api/v1/expenses/allowance";

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

    await fetchAllowance();
  };

  const fetchAllowance = async () => {
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

      const resJson = await response.json();
      if (response.ok && resJson.success && resJson.data) {
        allowanceState = resJson.data;
        renderAllowance();
      } else {
        showToast("Error", resJson.message || "Failed to load allowance.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the server.", "error");
    }
  };

  const renderAllowance = () => {
    if (!allowanceState) return;

    const {
      spentThisMonth,
      spentToday,
      elapsedDays,
      remainingDays,
      totalDays,
      todayExpenses
    } = allowanceState;

    // --- MATHEMATICAL FORMULATION ---
    // Total pocket money available at start of today is (overallBudget - spentBeforeToday)
    // where spentBeforeToday = spentThisMonth - spentToday.
    const spentBeforeToday = spentThisMonth - spentToday;
    const availableFunds = Math.max(0, overallBudget - spentBeforeToday);
    const startOfTodayAllowance = remainingDays > 0 ? (availableFunds / remainingDays) : 0;
    const remainingTodayAllowance = startOfTodayAllowance - spentToday;

    // --- KPI RENDERING ---
    kpiTodaySafe.innerText = `₹${remainingTodayAllowance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiTodaySafeFooter.innerText = `Starting budget today: ₹${startOfTodayAllowance.toFixed(0)}`;

    cardTodaySafe.className = "kpi-card allowance-primary-card";
    if (remainingTodayAllowance <= 0) {
      cardTodaySafe.classList.add("alert-mode");
    }

    kpiTodaySpent.innerText = `₹${spentToday.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiMonthLimit.innerText = `₹${overallBudget.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
    kpiMonthSpent.innerText = `₹${spentThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    kpiDaysRemaining.innerText = remainingDays;
    kpiTotalDays.innerText = `${totalDays} total days this month`;

    // --- TODAY'S TRANSACTIONS ---
    todayTxCount.innerText = `${todayExpenses.length} logged today`;
    if (todayExpenses.length === 0) {
      todayTxList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">No transactions logged today yet.</p>`;
    } else {
      todayTxList.innerHTML = todayExpenses.map(tx => {
        const icon = getCategoryIcon(tx.category);
        return `
          <div class="tx-item-row">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <div class="tx-category-icon" style="background: var(--expense-light); color: var(--expense-color); font-size:1.1rem; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <i class="${icon}"></i>
              </div>
              <div style="display:flex; flex-direction:column;">
                <span style="font-weight: 500; font-size: 0.9rem;">${tx.title}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${tx.category} • ${tx.paymentMethod}</span>
              </div>
            </div>
            <span style="font-weight: 600; color: var(--expense-color); font-size: 0.95rem;">
              -₹${tx.amount.toFixed(2)}
            </span>
          </div>
        `;
      }).join("");
    }

    // --- PACING GUIDE & BADGES ---
    const usagePercent = startOfTodayAllowance > 0 ? (spentToday / startOfTodayAllowance) : 0;
    
    pacingBadge.className = "pacing-badge";
    if (remainingTodayAllowance <= 0) {
      pacingBadge.innerText = "Overspent";
      pacingBadge.classList.add("pacing-danger");
      pacingAdvice.innerText = "You have exceeded today's safe allowance limit! Try to curb spending for the rest of today so you don't squeeze your daily allowance for tomorrow.";
    } else if (usagePercent >= 0.8) {
      pacingBadge.innerText = "Caution";
      pacingBadge.classList.add("pacing-warning");
      pacingAdvice.innerText = "You've spent more than 80% of today's safe limit. Put the wallet away if possible!";
    } else {
      pacingBadge.innerText = "On Track";
      pacingBadge.classList.add("pacing-good");
      pacingAdvice.innerText = "You're pacing beautifully! Staying below today's limit leaves more buffer to roll over, which will increase your daily allowance starting tomorrow.";
    }

    // --- MATH SUMMARY PANEL ---
    mathBudget.innerText = `₹${overallBudget.toLocaleString('en-IN')}`;
    mathSpent.innerText = `₹${spentBeforeToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    mathRemaining.innerText = `₹${availableFunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    mathDailyStart.innerText = `₹${startOfTodayAllowance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
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

  // --- LOGOUT ---
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  });

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

  // Run
  init();
});
