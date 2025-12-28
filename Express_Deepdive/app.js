const express = require("express");

const bodyParser = require('body-parser');

const app = express();

// first middleware to log requests
app.use((req, res, next) => {
  console.log("First dummy middleware");
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// second middleware to process requests
app.use((req, res, next) => {
  console.log("Processing request in second middleware");
  console.log("Second dummy middleware");
  console.log(`Request URL: ${req.url} {Method: ${req.method}}`);
  next();
});

// third middleware for returning a response
app.use((req, res, next) => {
  console.log("Third dummy middleware");
  //res.send("<h1>Hello from Express Project!</h1>");
  next(); // Removed: Don't call next() after sending response
});

// fourth middleware for specific route

app.get("/", (req, res, next) => {
  console.log("Handling / for GET: ", req.url, req.method);
  res.send("<h1>Welcome to Express Deepdive</h1>");
});

//fifth middleware for another specific route
app.get("/contact-us", (req, res, next) => {
  console.log("Handling /contact-us for GET: ", req.url, req.method);
  res.send(`<h1>Contact Us Page</h1>
    <p>Please fill the form to contact us.</p>

    <form action="/contact-us" method="POST">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <input type="submit" />
    </form>
    
    `);
});

// app.post('/contact-us', (req, res, next) => {
//     console.log("First Handling /contact-us for POST: ", req.url, req.method);
// });

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

//sixth middleware to handle POST request to /contact-us
app.post('/contact-us', (req, res, next) => {
    console.log("Handling /contact-us for POST: ", req.url, req.method);

    res.send("<h1>Thank you for contacting us!</h1>");

});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
