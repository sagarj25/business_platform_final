const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { user, business, amount } = req.body;
    
    const newTransaction = new Transaction({
      user,
      business,
      amount
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// Get all transactions for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId })
      .populate("business")
      .sort({ dateTime: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
