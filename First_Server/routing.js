// this file handles routing based on URL paths using Node.js and understands different routes

const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);

  // This routing logic handles different URL paths  
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Server</title></head>");
    res.write("<body><h1>Welcome to Home!</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url === '/products') {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Server</title></head>");
    res.write("<body><h1>Welcome to Products!</h1></body>");
    res.write("</html>");
    
    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Server</title></head>");
  res.write("<body><h1>Hello from my first server!</h1></body>");
  res.write("</html>");
  
  return res.end();
});



const PORT = 4500;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
