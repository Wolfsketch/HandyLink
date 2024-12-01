// server/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Haal het token uit de header
  const token = req.header("x-auth-token");

  // Controleer of er geen token is
  if (!token) {
    return res
      .status(401)
      .json({ message: "Geen token, autorisatie geweigerd" });
  }

  // Verifieer het token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is niet geldig" });
  }
};
