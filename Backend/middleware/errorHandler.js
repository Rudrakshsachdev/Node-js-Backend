const { constants } = require("../constants");


const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR: res.json({
        title: "Validation Error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    break;

    case constants.NOT_FOUND: res.json({
        title: "Not Found",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    break;

    case constants.SERVER_ERROR: res.json({
        title: "Server Error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    break;

    default: res.json({
        title: "Error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    break;
  }
}

module.exports = errorHandler;