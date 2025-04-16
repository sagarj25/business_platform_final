const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  amount: { type: Number, required: true },
  dateTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
