const http = require("http");
const fs = require("fs");

const { sumRequestHandler } = require("./Addition");

const Handler = (req, res) => {
  console.log("User requested URL:", req.url, req.method);

  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");

    res.write("<html>");

    res.write("<head> <title>Calculator Page</title> </head>");

    res.write("<body>");

    res.write("<h1>Welcome to the Calculator!</h1>");

    res.write("<ul>");

    res.write('<li><a href="/Calculator">Calculator</a></li>');

    res.write('<li><a href="/Contact">Contact Us</a></li>');

    res.write("</ul>");

    res.write("</body>");

    res.write("</html>");

    return res.end();
  } else if (req.url.toLowerCase() === "/calculator") {
    res.setHeader("Content-Type", "text/html");

    res.write("<html>");

    res.write("<head> <title>Calculator Page</title> </head>");

    res.write("<body>");

    res.write("<h1>Simple Calculator</h1>");

    res.write('<form action="/calculate-result" method="POST">');

    res.write('Number 1: <input type="number" name="num1" required><br>');

    res.write('Number 2: <input type="number" name="num2" required><br>');

    res.write('<button type="submit">Calculate Sum</button>');

    res.write("</form>");

    res.write("</body>");

    res.write("</html>");

    return res.end();
  } else if (
    req.url.toLowerCase() === "/calculate-result" &&
    req.method === "POST"
  ) {
    return sumRequestHandler(req, res);
  } else {
    res.setHeader("Content-Type", "text/html");

    res.write("<html>");

    res.write("<head> <title>404 Not Found</title> </head>");

    res.write("<body>");

    res.write("<h1>404 - Page Not Found</h1>");

    res.write("<p>The page you are looking for does not exist.</p>");

    res.write('Go back to <a href="/">Home</a>');

    res.write("</body>");

    res.write("</html>");

    return res.end();
  }
};

module.exports = Handler;
