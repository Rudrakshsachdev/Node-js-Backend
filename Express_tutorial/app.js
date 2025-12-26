// create a basic HTTP server that logs incoming requests

// this file was all about learning about npm and scripts in package.json


// this file is all about testing syntax and runtime errors in modules.


// external module
const express = require('express');

// core module

// local module
const user = require('./user');

// initialize express app
const app = express();




// first middleware to log requests
app.use((req, res, next) => {
    console.log('Came in first middleware: ', req.url, req.method);
    
    res.send('<h1>Hello from Express server!</h1>');


    next();
});

app.use((req, res, next) => {
    console.log('Came in Second middleware...');
    next();
});

app.use("/submit-details", (req, res, next) => {
    console.log('Came in Third middleware...');
    next();
});



const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`);
});
