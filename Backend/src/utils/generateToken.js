const jwt = require("jsonwebtoken");

/**
 * Generates a signed JSON Web Token (JWT) for a user.
 * @param {string} userId - The database identifier of the user.
 * @returns {string} The signed JWT token.
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
