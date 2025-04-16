const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const loyaltyRoutes = require("./routes/loyaltyRoutes");
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/user", userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
