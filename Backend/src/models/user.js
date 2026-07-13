const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true // Ensure email is stored in lowercase and trimmed
    },

    password: {
        type: String,
        required: true,
        minLength: 7
    },

    otpHash: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    lastOtpRequestedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;