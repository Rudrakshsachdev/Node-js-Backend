const path = require('path');

const express = require('express');

const hostRouter = express.Router();

const rootDir = require('../utils/pathUtil');

// this route handler will handle GET request to "/host/add-home" route
// this route handler will handle GET request to "/add-home" route
hostRouter.get("/host/add-home", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "addhome.html"));
});


// this route handler will handle POST request to "/add-home" route
hostRouter.post("/host/add-home", (req, res, next) => {
  //console.log(req.body);
  res.sendFile(path.join(rootDir, "views", "homeadded.html"));
});


module.exports = hostRouter;