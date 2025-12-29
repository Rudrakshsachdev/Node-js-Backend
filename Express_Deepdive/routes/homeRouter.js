const path = require("path");

const express = require("express");

const homeRouter = express.Router();

const rootDir = require("../utils/pathUtil");

// this route handler will handle GET request to "/" route
homeRouter.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "home.html"));
});

module.exports = homeRouter;
