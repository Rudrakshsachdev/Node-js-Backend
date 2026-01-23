const path = require('path');
const express = require('express');
const hostRouter = express.Router();
const rootDir = require('../utils/pathUtil');
const { homes } = require('../data/homesData');

// this route handler will handle GET request to "/host/add-home" route
hostRouter.get("/host/add-home", (req, res, next) => {
  res.render("addhome");
});


// this route handler will handle POST request to "/add-home" route
hostRouter.post("/host/add-home", (req, res, next) => {
    const { 'house-name': houseName, price, description } = req.body;
    homes.push({
      title: houseName,
      price: price || "0",
      description: description || "No description provided."
    });
  res.render("homeadded");
});


module.exports = hostRouter;