// this file is for building node js application

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth_route");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);

module.exports = app;
