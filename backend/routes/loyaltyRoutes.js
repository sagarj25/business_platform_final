const express = require("express");
const router = express.Router();
const LoyaltyToken = require("../models/LoyaltyToken");
const Transaction = require("../models/Transaction");

// Assign loyalty points after a transaction
router.post("/", async (req, res) => {
  try {
    const { user, business, transaction, points } = req.body;

    const newLoyaltyToken = new LoyaltyToken({
      user,
      business,
      transaction,
      points
    });

    await newLoyaltyToken.save();
    res.status(201).json(newLoyaltyToken);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign loyalty points" });
  }
});

// Fetch loyalty points for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const tokens = await LoyaltyToken.find({ user: req.params.userId })
      .populate("business transaction")
      .sort({ earnedAt: -1 });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loyalty points" });
  }
});

module.exports = router;
