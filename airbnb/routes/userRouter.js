//core modules
const path = require("path");

const express = require("express");

const userRouter = express.Router();

// this route handler will handle GET request to "/" home route
userRouter.get("/", (req, res, next) => {
  //console.log("First Middleware: Request received");

  //console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);

  res.sendFile(path.join(__dirname, "../", "views", "home.html"));
});

module.exports = userRouter;
