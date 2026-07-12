// this file is for building node js application

const express =  require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Expense Tracker Application");
})

module.exports = app;