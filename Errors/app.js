// create a basic HTTP server that logs incoming requests

// this file was all about learning about npm and scripts in package.json


// this file is all about testing syntax and runtime errors in modules.

const http = require('http');

const syntax = require('./syntax');

const runtime = require('./runtime');

const logical = require('./logical');

const server = http.createServer((req, res) => {
    console.log('Received request: ', req.url, req.method);
    
    syntax();

    //runtime();

    logical();


});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});