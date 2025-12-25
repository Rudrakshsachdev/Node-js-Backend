// create a basic HTTP server that logs incoming requests

// this file was all about learning about npm and scripts in package.json


// this file is all about testing syntax and runtime errors in modules.


// external module
const express = require('express');

// core module
const http = require('http');

// local module
const user = require('./user');

// initialize express app
const app = express();




// first middleware to log requests
app.use((req, res, next) => {
    console.log('Came in first middleware: ', req.url, req.method);
    next();
});

app.use((req, res, next) => {
    console.log('Came in Second middleware...');
    next();
});

const server = http.createServer(app);

const PORT = 3005;


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});