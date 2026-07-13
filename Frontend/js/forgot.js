document.addEventListener("DOMContentLoaded", () => {
  // Step Sections
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  
  // Indicators
  const stepItem1 = document.getElementById("stepItem1");
  const stepItem2 = document.getElementById("stepItem2");
  const stepItem3 = document.getElementById("stepItem3");
  const stepProgress = document.getElementById("stepProgress");

  // Step 1: Request elements
  const forgotForm = document.getElementById("forgotForm");
  const forgotEmailInput = document.getElementById("forgotEmail");
  const forgotEmailError = document.getElementById("forgotEmailError");
  const forgotBtn = document.getElementById("forgotBtn");
  const forgotSpinner = document.getElementById("forgotSpinner");

  // Step 2: Verify elements
  const verifyForm = document.getElementById("verifyForm");
  const otpCodeInput = document.getElementById("otpCode");
  const otpCodeError = document.getElementById("otpCodeError");
  const verifyBtn = document.getElementById("verifyBtn");
  const verifySpinner = document.getElementById("verifySpinner");

  // Step 3: Reset elements
  const resetForm = document.getElementById("resetForm");
  const newPasswordInput = document.getElementById("newPassword");
  const newPasswordError = document.getElementById("newPasswordError");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const resetBtn = document.getElementById("resetBtn");
  const resetSpinner = document.getElementById("resetSpinner");

  // Password strength elements
  const strengthContainer = document.getElementById("strengthContainer");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const reqLength = document.getElementById("reqLength");
  const reqUppercase = document.getElementById("reqUppercase");
  const reqLowercase = document.getElementById("reqLowercase");
  const reqNumber = document.getElementById("reqNumber");
  const reqSpecial = document.getElementById("reqSpecial");

  // State
  let userEmail = "";
  let passwordResetToken = "";

  // API Endpoints
  const BASE_URL = "http://localhost:3000/api/v1/auth";
  const FORGOT_URL = `${BASE_URL}/forgot-password`;
  const VERIFY_URL = `${BASE_URL}/verify-otp`;
  const RESET_URL = `${BASE_URL}/reset-password`;

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = newPasswordInput.getAttribute("type") === "password";
    newPasswordInput.setAttribute("type", isPassword ? "text" : "password");
    eyeIcon.className = isPassword ? "ph ph-eye-slash" : "ph ph-eye";
  });

  // Real-Time Password Checker
  const passwordRules = {
    length: (val) => val.length >= 8,
    uppercase: (val) => /[A-Z]/.test(val),
    lowercase: (val) => /[a-z]/.test(val),
    number: (val) => /[0-9]/.test(val),
    special: (val) => /[@$!%*?&]/.test(val)
  };

  newPasswordInput.addEventListener("input", () => {
    const val = newPasswordInput.value;
    if (val.length === 0) {
      strengthContainer.style.display = "none";
      return;
    }
    strengthContainer.style.display = "block";

    const results = {
      length: passwordRules.length(val),
      uppercase: passwordRules.uppercase(val),
      lowercase: passwordRules.lowercase(val),
      number: passwordRules.number(val),
      special: passwordRules.special(val)
    };

    updateRequirementUI(reqLength, results.length);
    updateRequirementUI(reqUppercase, results.uppercase);
    updateRequirementUI(reqLowercase, results.lowercase);
    updateRequirementUI(reqNumber, results.number);
    updateRequirementUI(reqSpecial, results.special);

    const passedCount = Object.values(results).filter(Boolean).length;
    updateStrengthBar(passedCount);
  });

  function updateRequirementUI(element, isValid) {
    const icon = element.querySelector(".req-icon");
    if (isValid) {
      element.classList.remove("invalid");
      element.classList.add("valid");
      icon.className = "ph ph-check-circle req-icon";
    } else {
      element.classList.remove("valid");
      element.classList.add("invalid");
      icon.className = "ph ph-circle-notch req-icon";
    }
  }

  function updateStrengthBar(score) {
    let width = "0%";
    let color = "#ef4444";
    let label = "Too Weak";

    switch (score) {
      case 1:
        width = "20%";
        color = "#ef4444";
        label = "Too Weak";
        break;
      case 2:
        width = "40%";
        color = "#f97316";
        label = "Weak";
        break;
      case 3:
        width = "60%";
        color = "#eab308";
        label = "Fair";
        break;
      case 4:
        width = "80%";
        color = "#3b82f6";
        label = "Good";
        break;
      case 5:
        width = "100%";
        color = "#10b981";
        label = "Strong & Secure";
        break;
    }
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.innerText = label;
    strengthText.style.color = color;
  }

  // Clear errors on input
  [forgotEmailInput, otpCodeInput, newPasswordInput].forEach(input => {
    input.addEventListener("input", () => {
      const errorSpan = document.getElementById(`${input.id}Error`);
      if (errorSpan) {
        errorSpan.classList.remove("visible");
        errorSpan.innerText = "";
      }
    });
  });

  // Step 1: Submit Request OTP
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = forgotEmailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showInputError(forgotEmailInput, "Email is required");
      return;
    }
    if (!emailPattern.test(email)) {
      showInputError(forgotEmailInput, "Invalid email format");
      return;
    }

    setButtonState(forgotBtn, forgotSpinner, true, "Sending OTP...");

    try {
      const response = await fetch(FORGOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Success", data.message, "success");
        userEmail = email;
        
        // Transition to Step 2
        step1.classList.remove("active");
        step2.classList.add("active");
        
        // Update Indicator
        stepItem1.classList.remove("active");
        stepItem1.classList.add("completed");
        stepItem2.classList.add("active");
        stepProgress.style.width = "50%";
      } else {
        showToast("Error", data.message || "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    } finally {
      setButtonState(forgotBtn, forgotSpinner, false, "Send OTP");
    }
  });

  // Step 2: Submit OTP Verification
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = otpCodeInput.value.trim();

    if (!otp) {
      showInputError(otpCodeInput, "OTP is required");
      return;
    }
    if (otp.length !== 6 || isNaN(otp)) {
      showInputError(otpCodeInput, "OTP must be exactly 6 digits");
      return;
    }

    setButtonState(verifyBtn, verifySpinner, true, "Verifying...");

    try {
      const response = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Verified", "OTP verified. Proceed to update password.", "success");
        passwordResetToken = data.resetToken;

        // Transition to Step 3
        step2.classList.remove("active");
        step3.classList.add("active");
        
        // Update Indicator
        stepItem2.classList.remove("active");
        stepItem2.classList.add("completed");
        stepItem3.classList.add("active");
        stepProgress.style.width = "100%";
      } else {
        showToast("Verification Failed", data.message || "Invalid OTP code.", "error");
        showInputError(otpCodeInput, data.message || "Invalid OTP code");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    } finally {
      setButtonState(verifyBtn, verifySpinner, false, "Verify OTP");
    }
  });

  // Step 3: Reset Password
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = newPasswordInput.value;

    if (!password) {
      showInputError(newPasswordInput, "Password is required");
      return;
    }

    const passedCount = Object.values(passwordRules).filter(rule => rule(password)).length;
    if (passedCount < 5) {
      showInputError(newPasswordInput, "Password does not meet validation rules.");
      return;
    }

    setButtonState(resetBtn, resetSpinner, true, "Updating...");

    try {
      const response = await fetch(RESET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: passwordResetToken, newPassword: password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Success", "Password updated! Redirecting to login...", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        showToast("Reset Failed", data.message || "Password update failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network Error", "Could not connect to the backend server.", "error");
    } finally {
      setButtonState(resetBtn, resetSpinner, false, "Reset Password");
    }
  });

  function showInputError(input, message) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (errorSpan) {
      errorSpan.innerText = message;
      errorSpan.classList.add("visible");
    }
  }

  function setButtonState(btn, spinner, isLoading, text) {
    const btnText = btn.querySelector("span");
    const btnArrow = btn.querySelector(".btn-arrow");
    
    if (isLoading) {
      btn.disabled = true;
      spinner.style.display = "block";
      if (btnArrow) btnArrow.style.display = "none";
      btnText.innerText = text;
      btn.style.opacity = "0.8";
    } else {
      btn.disabled = false;
      spinner.style.display = "none";
      if (btnArrow) btnArrow.style.display = "block";
      btnText.innerText = text;
      btn.style.opacity = "1";
    }
  }

  function showToast(title, message, type = "success") {
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
  }
});
