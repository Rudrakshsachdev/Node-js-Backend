// this file is for building node js application

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth_route");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets (css, js, etc.)
app.use(express.static(path.join(__dirname, "../../Frontend")));

// Backend routes serving frontend views
app.get("/auth/onboarding", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/signup.html"));
});

app.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/login.html"));
});

app.get("/auth/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/forgot-password.html"));
});

app.get("/auth/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/dashboard.html"));
});

app.get("/auth/transactions", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/transactions.html"));
});

app.get("/auth/analytics", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/analytics.html"));
});

app.get("/auth/forecast", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/Pages/forecast.html"));
});

// Alias routes to support seamless navigation between local static servers and Express
app.get("/auth/login.html", (req, res) => {
  res.redirect("/auth/login");
});


app.get("/auth/signup.html", (req, res) => {
  res.redirect("/auth/onboarding");
});

app.get("/auth/forgot", (req, res) => {
  res.redirect("/auth/forgot-password");
});

app.get("/auth/forgot.html", (req, res) => {
  res.redirect("/auth/forgot-password");
});

app.get("/auth/forgot-password.html", (req, res) => {
  res.redirect("/auth/forgot-password");
});

app.get("/Frontend/Pages/signup.html", (req, res) => {
  res.redirect("/auth/onboarding");
});

app.get("/Frontend/Pages/login.html", (req, res) => {
  res.redirect("/auth/login");
});

app.get("/Frontend/Pages/forgot.html", (req, res) => {
  res.redirect("/auth/forgot-password");
});

app.get("/auth/dashboard.html", (req, res) => {
  res.redirect("/auth/dashboard");
});

app.get("/Frontend/Pages/dashboard.html", (req, res) => {
  res.redirect("/auth/dashboard");
});

app.get("/auth/transactions.html", (req, res) => {
  res.redirect("/auth/transactions");
});

app.get("/Frontend/Pages/transactions.html", (req, res) => {
  res.redirect("/auth/transactions");
});

app.get("/auth/analytics.html", (req, res) => {
  res.redirect("/auth/analytics");
});

app.get("/Frontend/Pages/analytics.html", (req, res) => {
  res.redirect("/auth/analytics");
});

app.get("/auth/forecast.html", (req, res) => {
  res.redirect("/auth/forecast");
});

app.get("/Frontend/Pages/forecast.html", (req, res) => {
  res.redirect("/auth/forecast");
});

// API routes
const expenseRoutes = require("./routes/expense.routes");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);

module.exports = app;
