const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");

const registerUser = expressAsyncHandler(async (req, res) => {   
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bycrypt.hash(password, 10);


    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log("Created user:", user);

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const user = await User.findOne({ email });

    if (user && (await bycrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


const currentUser = expressAsyncHandler(async (req, res) => {
    req.json({ message: "Current user information", user: req.user });
})

module.exports = {
    registerUser,
    loginUser,
    currentUser
};