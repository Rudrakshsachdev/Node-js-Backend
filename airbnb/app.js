// external module
const express = require("express");

const path = require("path");

const app = express();

const PORT = 2025;

const userRouter = require('./routes/userRouter');

const hostRouter = require('./routes/hostRouter');

const rootDir = require('./utils/pathUtil');

// this middleware will log request method and url
app.use((req, res, next) => {
  console.log("First Middleware: Request received");
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// first route middleware
app.use(userRouter);

// second route middleware
app.use(hostRouter);

// middleware to handle 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, "views", "404page.html"));    
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
