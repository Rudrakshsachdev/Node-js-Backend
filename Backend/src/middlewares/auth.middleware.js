const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token and protect backend routes.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload containing 'id' to the request object
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired.",
    });
  }
};

module.exports = authMiddleware;
