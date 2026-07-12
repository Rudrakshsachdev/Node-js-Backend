const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asynchandler(async (req, res, next) => {
    let token;

    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            console.log("Decoded token:", decoded);

            // Attach the decoded user information to the request object
            req.user = decoded.user;

            // Call the next middleware or route handler
            next();
        });
    } else {
        res.status(401);
        throw new Error("User is not authorized");
    }
});

module.exports = validateToken;