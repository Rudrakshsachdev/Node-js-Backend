const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addPayment,
  updatePayment,
  deletePayment
} = require("../controllers/freelance.controller");

// Protect all freelance routes
router.use(authMiddleware);

// Project CRUD
router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Payment CRUD
router.post("/:id/payments", addPayment);
router.put("/:id/payments/:paymentId", updatePayment);
router.delete("/:id/payments/:paymentId", deletePayment);

module.exports = router;
