const path = require('path');

const express = require('express');

const contactUsRouter = express.Router();

const rootDir = require('../utils/pathUtil');

// this route handler will handle GET request to "/contact-us" route
contactUsRouter.get('/contact-us', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'contactUs.html'));
});


// this route handler will handle POST request to "/contact-us" route
contactUsRouter.post('/contact-us', (req, res, next) => {
    //console.log(req.body);
    res.sendFile(path.join(rootDir, 'views', 'formSubmitted.html'));
});

module.exports = contactUsRouter;