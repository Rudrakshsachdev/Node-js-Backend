const express = require('express');

const hostRouter = express.Router();

// this route handler will handle GET request to "/host/add-home" route
// this route handler will handle GET request to "/add-home" route
hostRouter.get("/host/add-home", (req, res, next) => {
  res.send(`<h1>Add Your Home</h1>
    <form action="/host/add-home" method="POST">
      <input type="text" name="house-name" placeholder="Enter the name of your house" required />
      <input type="submit" />
      </form>`);
});


// this route handler will handle POST request to "/add-home" route
hostRouter.post("/host/add-home", (req, res, next) => {
  console.log(req.body);
  res.send(`<h1>Thank you for adding your home!</h1>
        <a href="/">Go to Home</a>
     `);
});


module.exports = hostRouter;