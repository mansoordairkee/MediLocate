require("dotenv").config();

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET   
    );

    req.user = verified;

    next();

  } catch (err) {

    console.log("JWT ERROR:", err.message);

    return res.status(403).json({
      error: "Invalid token"
    });

  }
}

module.exports = authMiddleware;