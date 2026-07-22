const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: String,
    required: true
  },
  method: {
    type: String,
    default: "UPI"
  },
  status: {
    type: String,
    enum: ["Received", "Pending"],
    default: "Received"
  },
  transactionId: {
    type: String,
    default: "",
    trim: true
  },
  notes: {
    type: String,
    default: "",
    trim: true
  }
}, { timestamps: true });

const freelanceProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  receivedDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ["Active", "Inactive", "Completed"],
    default: "Active"
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: String,
    default: ""
  },
  payments: [paymentSchema]
}, { timestamps: true });

const FreelanceProject = mongoose.model("FreelanceProject", freelanceProjectSchema);

module.exports = FreelanceProject;
