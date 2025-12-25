// create a basic HTTP server that logs incoming requests

// this file was all about learning about npm and scripts in package.json

const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Received request: ', req);
    process.exit(); // Exit after logging the request
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});