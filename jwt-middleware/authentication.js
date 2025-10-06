const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";

function authMiddleware(req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).send({ error: "No token provided" });

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).send({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
