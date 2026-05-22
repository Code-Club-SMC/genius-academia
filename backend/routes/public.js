const express = require("express");
const router = express.Router();
const {
  publicRegister,
  getPendingRegistrations,
  getPendingStudent,
  approveRegistration,
  rejectRegistration,
  getPendingCount,
  getNextStudentId,
  updateStudentCredentials,
  publicInquiry,
} = require("../controllers/publicController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * Public Routes
 * Some routes are public (no auth), others are protected.
 */

// ========================================
// PUBLIC ROUTES (No Login Required)
// ========================================

// Student self-registration
router.post("/register", publicRegister);

// Public inquiry submission (Contact Form)
router.post("/inquiry", publicInquiry);

// ========================================
// PROTECTED ROUTES (Admin / Staff approval)
// ========================================

// Get all pending registrations
router.get(
  "/pending",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  getPendingRegistrations,
);

// Get single pending registration by ID
router.get(
  "/pending/:id",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  getPendingStudent,
);

// Get pending count (for sidebar badge)
router.get("/pending-count", protect, getPendingCount);

// Get next available Student ID
router.get(
  "/next-id",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  getNextStudentId,
);

// Approve a registration
router.post(
  "/approve/:id",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  approveRegistration,
);

// Reject a registration
router.delete(
  "/reject/:id",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  rejectRegistration,
);

// Update student credentials (ID/Password)
router.patch(
  "/update-credentials/:id",
  protect,
  restrictTo("OWNER", "OPERATOR", "ADMIN", "STAFF"),
  updateStudentCredentials,
);

module.exports = router;
