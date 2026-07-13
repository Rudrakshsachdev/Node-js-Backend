document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  
  // Strength Indicator Elements
  const strengthContainer = document.getElementById("strengthContainer");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  
  // Requirement List Elements
  const reqLength = document.getElementById("reqLength");
  const reqUppercase = document.getElementById("reqUppercase");
  const reqLowercase = document.getElementById("reqLowercase");
  const reqNumber = document.getElementById("reqNumber");
  const reqSpecial = document.getElementById("reqSpecial");
  
  // Spinner & Button
  const submitBtn = document.getElementById("submitBtn");
  const btnSpinner = document.getElementById("btnSpinner");
  const btnArrow = submitBtn.querySelector(".btn-arrow");
  const btnText = submitBtn.querySelector("span");

  // Error spans
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Backend API URL
  const API_URL = `${CONFIG.API_BASE_URL}/api/v1/auth/onboarding`;

  // Password Visibility Toggle
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    
    // Update Eye Icon
    eyeIcon.className = isPassword ? "ph ph-eye-slash" : "ph ph-eye";
  });

  // Password Strength Regex Rules
  const rules = {
    length: (val) => val.length >= 8,
    uppercase: (val) => /[A-Z]/.test(val),
    lowercase: (val) => /[a-z]/.test(val),
    number: (val) => /[0-9]/.test(val),
    special: (val) => /[@$!%*?&]/.test(val)
  };

  // Real-Time Password Checker
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    if (val.length === 0) {
      strengthContainer.style.display = "none";
      return;
    }

    strengthContainer.style.display = "block";

    // Validate each rule and update UI
    const results = {
      length: rules.length(val),
      uppercase: rules.uppercase(val),
      lowercase: rules.lowercase(val),
      number: rules.number(val),
      special: rules.special(val)
    };

    updateRequirementUI(reqLength, results.length);
    updateRequirementUI(reqUppercase, results.uppercase);
    updateRequirementUI(reqLowercase, results.lowercase);
    updateRequirementUI(reqNumber, results.number);
    updateRequirementUI(reqSpecial, results.special);

    // Calculate score (0 to 5)
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
    let color = "var(--error-color)";
    let label = "Too Weak";

    switch (score) {
      case 1:
        width = "20%";
        color = "#ef4444"; // Red
        label = "Too Weak";
        break;
      case 2:
        width = "40%";
        color = "#f97316"; // Orange
        label = "Weak";
        break;
      case 3:
        width = "60%";
        color = "#eab308"; // Yellow
        label = "Fair";
        break;
      case 4:
        width = "80%";
        color = "#3b82f6"; // Blue
        label = "Good";
        break;
      case 5:
        width = "100%";
        color = "var(--success-color)"; // Emerald
        label = "Strong & Secure";
        break;
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.innerText = label;
    strengthText.style.color = color;
  }

  // Clear errors on input
  [nameInput, emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => {
      const errorSpan = document.getElementById(`${input.id}Error`);
      errorSpan.classList.remove("visible");
      errorSpan.innerText = "";
    });
  });

  // Client-Side Validator Function
  function validateForm() {
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showInputError(nameInput, "Name is required");
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showInputError(nameInput, "Name must be at least 3 characters long");
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showInputError(emailInput, "Email is required");
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      showInputError(emailInput, "Invalid email format");
      isValid = false;
    }

    // Validate Password
    const passwordVal = passwordInput.value;
    if (!passwordVal) {
      showInputError(passwordInput, "Password is required");
      isValid = false;
    } else {
      const passedCount = Object.values(rules).filter(r => r(passwordVal)).length;
      if (passedCount < 5) {
        showInputError(passwordInput, "Password must satisfy all requirements");
        isValid = false;
      }
    }

    return isValid;
  }

  function showInputError(input, message) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    errorSpan.innerText = message;
    errorSpan.classList.add("visible");
  }

  // Form Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Validation Error", "Please correct the highlighted fields.", "error");
      return;
    }

    // Enter loading state
    setLoadingState(true);

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Registration Successful!", "Welcome to ExpenseTracker.", "success");
        
        // Save token to localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Reset form
        form.reset();
        strengthContainer.style.display = "none";
        
      } else {
        // Handle express-validator errors or other backend responses
        let message = data.message || "Registration failed.";
        if (data.errors && Array.isArray(data.errors)) {
          // If there are field-specific errors, map them
          data.errors.forEach(err => {
            if (err.path === "name") showInputError(nameInput, err.msg);
            if (err.path === "email") showInputError(emailInput, err.msg);
            if (err.path === "password") showInputError(passwordInput, err.msg);
          });
          message = data.errors[0].msg;
        }
        showToast("Registration Failed", message, "error");
      }
    } catch (err) {
      console.error("Signup network error:", err);
      showToast("Network Error", "Could not connect to the authentication server.", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnSpinner.style.display = "block";
      btnArrow.style.display = "none";
      btnText.innerText = "Creating account...";
      submitBtn.style.opacity = "0.8";
    } else {
      submitBtn.disabled = false;
      btnSpinner.style.display = "none";
      btnArrow.style.display = "block";
      btnText.innerText = "Create Account";
      submitBtn.style.opacity = "1";
    }
  }

  // Toast System
  function showToast(title, message, type = "success") {
    const container = document.getElementById("toastContainer");
    
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

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
});
