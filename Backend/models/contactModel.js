const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;