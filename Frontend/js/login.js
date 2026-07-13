document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  
  // Spinner & Button
  const submitBtn = document.getElementById("submitBtn");
  const btnSpinner = document.getElementById("btnSpinner");
  const btnArrow = submitBtn.querySelector(".btn-arrow");
  const btnText = submitBtn.querySelector("span");

  // Error spans
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Backend API URL
  const API_URL = `${CONFIG.API_BASE_URL}/api/v1/auth/login`;

  // Password Visibility Toggle
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    
    // Update Eye Icon
    eyeIcon.className = isPassword ? "ph ph-eye-slash" : "ph ph-eye";
  });

  // Clear errors on input
  [emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => {
      const errorSpan = document.getElementById(`${input.id}Error`);
      if (errorSpan) {
        errorSpan.classList.remove("visible");
        errorSpan.innerText = "";
      }
    });
  });

  // Client-Side Validator
  function validateForm() {
    let isValid = true;

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
    if (!passwordInput.value) {
      showInputError(passwordInput, "Password is required");
      isValid = false;
    }

    return isValid;
  }

  function showInputError(input, message) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (errorSpan) {
      errorSpan.innerText = message;
      errorSpan.classList.add("visible");
    }
  }

  // Form Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Validation Error", "Please fill in the required fields correctly.", "error");
      return;
    }

    // Enter loading state
    setLoadingState(true);

    const payload = {
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
        showToast("Welcome!", "Login successful. Redirecting...", "success");
        
        // Save token & user to localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect to dashboard after a brief delay for user feedback
        setTimeout(() => {
          window.location.href = "/dashboard.html";
        }, 1200);
        
      } else {
        let message = data.message || "Invalid credentials.";
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => {
            if (err.path === "email") showInputError(emailInput, err.msg);
            if (err.path === "password") showInputError(passwordInput, err.msg);
          });
          message = data.errors[0].msg;
        }
        showToast("Login Failed", message, "error");
      }
    } catch (err) {
      console.error("Login network error:", err);
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
      btnText.innerText = "Signing in...";
      submitBtn.style.opacity = "0.8";
    } else {
      submitBtn.disabled = false;
      btnSpinner.style.display = "none";
      btnArrow.style.display = "block";
      btnText.innerText = "Sign In";
      submitBtn.style.opacity = "1";
    }
  }

  // Toast System
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

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
});
