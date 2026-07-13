document.addEventListener("DOMContentLoaded", () => {
  // Check auth token
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/auth/login";
    return;
  }

  // --- STATE ---
  let forecastState = null;
  let overallBudget = parseFloat(localStorage.getItem("overallBudget")) || 5000;

  // --- SELECTORS ---
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const userInitial = document.getElementById("userInitial");
  const logoutBtn = document.getElementById("logoutBtn");

  const kpiSpent = document.getElementById("kpiSpent");
  const kpiDaysElapsed = document.getElementById("kpiDaysElapsed");
  const kpiDaysRemaining = document.getElementById("kpiDaysRemaining");
  const kpiTotalDays = document.getElementById("kpiTotalDays");
  const kpiVelocity = document.getElementById("kpiVelocity");
  const kpiForecast = document.getElementById("kpiForecast");
  const kpiForecastFooter = document.getElementById("kpiForecastFooter");
  const forecastCard = document.getElementById("forecastCard");
  const forecastIcon = document.getElementById("forecastIcon");
  const kpiBudget = document.getElementById("kpiBudget");

  // Comparison elements
  const compIncome = document.getElementById("compIncome");
  const compExpense = document.getElementById("compExpense");
  const compNetSaving = document.getElementById("compNetSaving");
  const compBudget = document.getElementById("compBudget");
  const compHeadroom = document.getElementById("compHeadroom");

  // Simulator elements
  const dailySpendSlider = document.getElementById("dailySpendSlider");
  const sliderValDisplay = document.getElementById("sliderValDisplay");
  const simForecast = document.getElementById("simForecast");
  const simDesc = document.getElementById("simDesc");
  const simOutputBox = document.getElementById("simOutputBox");

  const API_URL = "http://localhost:3000/api/v1/expenses/forecast";

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

    await fetchForecast();
  };

  const fetchForecast = async () => {
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
        forecastState = resJson.data;
        
        // Initialize slider to current daily velocity
        const currentDailyVal = Math.round(forecastState.dailyRate);
        dailySpendSlider.value = currentDailyVal;
        sliderValDisplay.innerText = `₹${currentDailyVal}`;

        renderPage();
      } else {
        showToast("Error", resJson.message || "Failed to load forecast.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    }
  };

  const renderPage = () => {
    if (!forecastState) return;

    const {
      spentSoFar,
      incomeSoFar,
      dailyRate,
      elapsedDays,
      remainingDays,
      totalDays,
      projectedRemaining,
      forecastedExpenses
    } = forecastState;

    // 1. KPI Cards
    kpiSpent.innerText = `₹${spentSoFar.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiDaysElapsed.innerText = `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} elapsed`;
    
    kpiDaysRemaining.innerText = remainingDays;
    kpiTotalDays.innerText = `${totalDays} total days this month`;
    
    kpiVelocity.innerText = `₹${dailyRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    kpiForecast.innerText = `₹${forecastedExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiBudget.innerText = `₹${overallBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Overall Forecast Card styles
    const isOverBudget = forecastedExpenses > overallBudget;
    const budgetDiff = Math.abs(overallBudget - forecastedExpenses);
    
    forecastCard.className = "kpi-card";
    if (isOverBudget) {
      forecastCard.classList.add("forecast-alert");
      forecastIcon.innerHTML = `<i class="ph ph-trend-up"></i>`;
      kpiForecastFooter.innerHTML = `<span class="trend-down">₹${budgetDiff.toFixed(0)} over budget</span> projected`;
    } else {
      forecastCard.classList.add("forecast-safe");
      forecastIcon.innerHTML = `<i class="ph ph-trend-down"></i>`;
      kpiForecastFooter.innerHTML = `<span class="trend-up">₹${budgetDiff.toFixed(0)} under budget</span> projected`;
    }

    // 2. Net Comparison Table
    compIncome.innerText = `₹${incomeSoFar.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    compExpense.innerText = `₹${forecastedExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    const netSaving = incomeSoFar - forecastedExpenses;
    compNetSaving.innerText = `₹${netSaving.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    compNetSaving.className = `comparison-value ${netSaving >= 0 ? 'trend-up' : 'trend-down'}`;

    compBudget.innerText = `₹${overallBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    const headroom = overallBudget - forecastedExpenses;
    compHeadroom.innerText = `₹${headroom.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    compHeadroom.className = `comparison-value ${headroom >= 0 ? 'trend-up' : 'trend-down'}`;

    // 3. Update Simulator Output
    updateSimulatorOutput(Math.round(dailyRate));
  };

  const updateSimulatorOutput = (simulatedDaily) => {
    if (!forecastState) return;

    const { spentSoFar, remainingDays } = forecastState;
    const simProjRemaining = simulatedDaily * remainingDays;
    const simTotalForecast = spentSoFar + simProjRemaining;

    simForecast.innerText = `₹${simTotalForecast.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const isOver = simTotalForecast > overallBudget;
    const diff = Math.abs(overallBudget - simTotalForecast);

    simOutputBox.className = "proj-output";
    if (isOver) {
      simOutputBox.classList.add("proj-output", "alert-mode");
      simDesc.innerHTML = `<span class="trend-down">Warning: This rate puts you ₹${diff.toFixed(0)} OVER your budget.</span>`;
    } else {
      simDesc.innerHTML = `<span class="trend-up">Safe: You will finish ₹${diff.toFixed(0)} UNDER your budget limit.</span>`;
    }
  };

  // --- EVENT LISTENERS ---
  dailySpendSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    sliderValDisplay.innerText = `₹${val}`;
    updateSimulatorOutput(val);
  });

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

  // Init
  init();
});
