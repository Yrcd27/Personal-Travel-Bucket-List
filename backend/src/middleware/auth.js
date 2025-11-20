const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || "changeme");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticateToken };