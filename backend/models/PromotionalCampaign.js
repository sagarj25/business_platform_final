const mongoose = require("mongoose");

const PromotionalCampaignSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  businessName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("PromotionalCampaign", PromotionalCampaignSchema);
