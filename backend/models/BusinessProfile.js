const mongoose = require("mongoose");

const BusinessProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of business
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // URL for business logo/storefront
  promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "PromotionalCampaign" }], // Linked promotions
  loyaltyTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoyaltyToken" }] // Connected loyalty rewards
}, { timestamps: true });

module.exports = mongoose.model("BusinessProfile", BusinessProfileSchema);
