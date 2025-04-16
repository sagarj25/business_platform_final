const express = require("express");
const PromotionalCampaign = require("../models/PromotionalCampaign");
const BusinessProfile = require("../models/BusinessProfile");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const upload = require("../middleware/upload");
const path = require("path");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole("business_owner"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, budget, startDate, endDate, business, businessName } = req.body;

      if (!title || !description || !startDate || !endDate || !budget || !business || !businessName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imageUrl = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "";

      const newCampaign = new PromotionalCampaign({
        business,
        businessName,
        title,
        description,
        budget,
        startDate,
        endDate,
        imageUrl,
      });

      const savedCampaign = await newCampaign.save();

      await BusinessProfile.findByIdAndUpdate(business, {
        $push: { promotions: savedCampaign._id },
      });

      res.status(201).json(savedCampaign);
    } catch (error) {
      console.error("Error in creating campaign:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
// GET /api/campaign/user/:userId
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const campaigns = await PromotionalCampaign.find()
      .populate({
        path: "business",
        match: { user: userId }, // filter businesses by userId
      })
      .lean();

    // Filter out campaigns where business is null (not owned by user)
    const filteredCampaigns = campaigns.filter(c => c.business !== null);

    res.json(filteredCampaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
