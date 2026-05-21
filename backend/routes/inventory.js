const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/authMiddleware");

/**
 * Inventory / Asset Registry Routes
 * All routes are protected (admin/staff access)
 */

// GET /api/inventory — List all assets
router.get("/", protect, async (req, res) => {
  try {
    const assets = await Inventory.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: assets });
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch inventory", error: error.message });
  }
});

// POST /api/inventory — Create a new asset
router.post("/", protect, async (req, res) => {
  try {
    const { itemName, investorName, purchaseDate, originalCost, depreciationRate } = req.body;

    if (!itemName || !purchaseDate || !originalCost) {
      return res.status(400).json({ success: false, message: "itemName, purchaseDate, and originalCost are required" });
    }

    const asset = await Inventory.create({
      itemName,
      investorName: investorName || "Academy",
      purchaseDate,
      originalCost: Number(originalCost),
      depreciationRate: depreciationRate != null ? Number(depreciationRate) : 10,
    });

    console.log(`📦 Asset created: ${asset.itemName} — PKR ${asset.originalCost}`);
    return res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error("❌ Error creating asset:", error);
    return res.status(500).json({ success: false, message: "Failed to create asset", error: error.message });
  }
});

// PUT /api/inventory/:id — Update an asset
router.put("/:id", protect, async (req, res) => {
  try {
    const { itemName, investorName, purchaseDate, originalCost, depreciationRate } = req.body;

    if (!itemName || !purchaseDate || !originalCost) {
      return res.status(400).json({ success: false, message: "itemName, purchaseDate, and originalCost are required" });
    }

    const asset = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        itemName,
        investorName: investorName || "Academy",
        purchaseDate,
        originalCost: Number(originalCost),
        depreciationRate: depreciationRate != null ? Number(depreciationRate) : 10,
      },
      { new: true },
    );

    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }

    console.log(`✏️ Asset updated: ${asset.itemName} — PKR ${asset.originalCost}`);
    return res.status(200).json({ success: true, data: asset });
  } catch (error) {
    console.error("❌ Error updating asset:", error);
    return res.status(500).json({ success: false, message: "Failed to update asset", error: error.message });
  }
});

// DELETE /api/inventory/:id — Delete an asset
router.delete("/:id", protect, async (req, res) => {
  try {
    const asset = await Inventory.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    console.log(`🗑️ Asset deleted: ${asset.itemName}`);
    return res.status(200).json({ success: true, message: "Asset deleted" });
  } catch (error) {
    console.error("❌ Error deleting asset:", error);
    return res.status(500).json({ success: false, message: "Failed to delete asset", error: error.message });
  }
});

module.exports = router;
