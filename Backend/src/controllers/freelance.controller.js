const FreelanceProject = require("../models/freelance.model");

// GET /api/v1/freelance - Get all projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await FreelanceProject.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/freelance - Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, receivedDate, description, technologies, status, isCompleted, completionDate } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }

    const project = await FreelanceProject.create({
      userId: req.user.id,
      title,
      receivedDate: receivedDate || new Date().toISOString().split("T")[0],
      description: description || "",
      technologies: technologies || [],
      status: isCompleted ? "Completed" : (status || "Active"),
      isCompleted: !!isCompleted,
      completionDate: isCompleted ? (completionDate || new Date().toISOString().split("T")[0]) : "",
      payments: []
    });

    return res.status(201).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/v1/freelance/:id - Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, receivedDate, description, technologies, status, isCompleted, completionDate } = req.body;
    const project = await FreelanceProject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.title = title || project.title;
    project.receivedDate = receivedDate || project.receivedDate;
    project.description = description !== undefined ? description : project.description;
    project.technologies = technologies || project.technologies;
    project.isCompleted = isCompleted !== undefined ? isCompleted : project.isCompleted;
    project.status = project.isCompleted ? "Completed" : (status || project.status);
    project.completionDate = project.isCompleted ? (completionDate || project.completionDate) : "";

    await project.save();
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/freelance/:id - Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/freelance/:id/payments - Add payment
exports.addPayment = async (req, res) => {
  try {
    const { title, amount, date, method, status, transactionId, notes } = req.body;
    const project = await FreelanceProject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const newPayment = {
      title: title || "Payment",
      amount: parseFloat(amount) || 0,
      date: date || new Date().toISOString().split("T")[0],
      method: method || "UPI",
      status: status || "Received",
      transactionId: transactionId || "",
      notes: notes || ""
    };

    project.payments.push(newPayment);
    await project.save();
    return res.status(201).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/v1/freelance/:id/payments/:paymentId - Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { title, amount, date, method, status, transactionId, notes } = req.body;
    const project = await FreelanceProject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const payment = project.payments.id(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    payment.title = title || payment.title;
    payment.amount = amount !== undefined ? parseFloat(amount) : payment.amount;
    payment.date = date || payment.date;
    payment.method = method || payment.method;
    payment.status = status || payment.status;
    payment.transactionId = transactionId !== undefined ? transactionId : payment.transactionId;
    payment.notes = notes !== undefined ? notes : payment.notes;

    await project.save();
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/freelance/:id/payments/:paymentId - Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const project = await FreelanceProject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.payments.pull({ _id: req.params.paymentId });
    await project.save();
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
