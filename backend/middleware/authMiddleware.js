const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Include businessProfiles if it's part of the payload
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      businessProfiles: decoded.businessProfiles || [], // ✅ added this
    };

    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

module.exports = authMiddleware;
