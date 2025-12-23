// this file is all about creating a simple server that imports the request handler from another module and starts listening on a specified port.

// We import the 'http' module to create the server and the 'fs' module for file operations. The request handler is imported from the 'user.js' file.

const http = require('http');

const fs = require('fs');

const userReqHandler =  require('./user');

const server = http.createServer(userReqHandler);

const PORT = 5200;

server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});