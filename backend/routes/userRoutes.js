const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role }; // ✅ Correct fix
    next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET /api/user - Get current user details
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email role createdAt loyaltyTokens businessProfiles")
      .populate({
        path: "loyaltyTokens",
        populate: {
          path: "business",
          select: "name"
        }
      })
      .populate({
        path: "businessProfiles",
        select: "name industry location"
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    const formattedTokens = user.loyaltyTokens?.map(token => ({
      points: token.points,
      expiryDate: token.expiryDate,
      businessName: token.business?.name || "N/A"
    })) || [];

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      tokens: formattedTokens,
      businessProfiles: user.businessProfiles
    });
  } catch (err) {
    console.error("Error in GET /api/user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
