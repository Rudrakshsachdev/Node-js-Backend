const express = require('express');

const userRouter = express.Router();

// this route handler will handle GET request to "/" home route
userRouter.get("/", (req, res, next) => {
  //console.log("First Middleware: Request received");

  //console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);

  res.send(`<h1>Welcome to Airbnb!</h1>   
        <a href="/host/add-home">Add Home</a><br/>
        `);
});

module.exports = userRouter;