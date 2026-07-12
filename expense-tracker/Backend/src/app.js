// this file is for building node js application

const express =  require("express");

const authRoute = require("./routes/auth_route");

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Welcome to Expense Tracker API");
});

module.exports = app;