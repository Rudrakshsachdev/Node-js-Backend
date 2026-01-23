// external module
const express = require("express");

const path = require("path");

const app = express();

// set EJS as the templating engine
app.set('view engine', 'ejs');

// set the views directory
app.set('views', 'views');

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

// middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// first route middleware
app.use(userRouter);

// second route middleware
app.use(hostRouter);

// middleware to handle 404 errors
app.use((req, res, next) => {
    res.status(404).render("404page");    
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
