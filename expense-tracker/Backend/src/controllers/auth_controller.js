const getAuthMessage = (req, res) => {
    res.send("Welcome to Expense Tracker Auth API Controller");
}

const registerUser = async (req, res) => {
    console.log("Registering user with data:", req.body);

    res.status(201).json({ message: "User registered successfully", data: req.body });
}

module.exports = {
    getAuthMessage,
    registerUser
};