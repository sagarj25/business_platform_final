const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "business_owner", "customer"], default: "customer" },
  businessProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile" }], // A user can own multiple businesses
  loyaltyTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoyaltyToken" }] // Connects with loyalty system
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
