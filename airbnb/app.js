// external module
const express = require("express");

const app = express();

const PORT = 2025;

const userRouter = require('./routes/userRouter');

const hostRouter = require('./routes/hostRouter');


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

app.use((req, res, next) => {
    res.status(404).send("<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>");
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
