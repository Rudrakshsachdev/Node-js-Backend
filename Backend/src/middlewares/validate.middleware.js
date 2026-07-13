// This file is for validating the request body using express-validator


const { validationResult } = require('express-validator');


// This function is used to validate the request body and return errors if any
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({ path: err.path || err.param, msg: err.msg })),
    });
};

module.exports = {
    validateRequest,
};