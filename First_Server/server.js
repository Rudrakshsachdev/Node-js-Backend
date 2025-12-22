// this file creates a simple HTTP server using Node.js and sends a basic HTML response

const http = require('http');


const server = http.createServer((req, res) => {

    // Log the request details to the console
    console.log(req.url, req.method, req.headers);

    // Set the response header and send a simple HTML response
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>My First Server</title></head>')
    res.write('<body><h1>Hello from my first server!</h1></body>')
    res.write('</html>')
    res.end();
})

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


