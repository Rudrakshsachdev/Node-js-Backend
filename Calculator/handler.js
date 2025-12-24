// this file is responsible for setting up the HTTP server and linking it to the request handler

const http = require('http');

const requestHandler = require('./home');

const server = http.createServer(requestHandler);

const PORT = 5400;

server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});

