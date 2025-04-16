const mongoose = require("mongoose");

const LoyaltyTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
  points: { type: Number, required: true },
  earnedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("LoyaltyToken", LoyaltyTokenSchema);
