const express = require("express");
const BusinessProfile = require("../models/BusinessProfile");
const User = require("../models/User");
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE Business Profile (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const userId = req.body.user || req.query.user;
    const { businessName, category, description } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newBusiness = new BusinessProfile({
      user: userId,
      businessName,
      category,
      description,
      imageUrl,
    });

    const savedBusiness = await newBusiness.save();

    await User.findByIdAndUpdate(userId, {
      $push: { businessProfiles: savedBusiness._id },
    });

    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error("Error saving business:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all Business Profiles
router.get("/", async (req, res) => {
  try {
    const businesses = await BusinessProfile.find().populate("user", "name email");
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Business Profiles by User
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const businesses = await BusinessProfile.find({ user: userId })
      .populate("user", "name email")
      .populate("promotions")
      .populate("loyaltyTokens");

    res.status(200).json(businesses);
  } catch (error) {
    console.error("Error fetching businesses by user:", error);
    res.status(500).json({ message: "Server error while fetching businesses." });
  }
});

// GET a Single Business
router.get("/:id", async (req, res) => {
  try {
    const business = await BusinessProfile.findById(req.params.id).populate("user", "name email");
    if (!business) return res.status(404).json({ message: "Business not found" });

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
