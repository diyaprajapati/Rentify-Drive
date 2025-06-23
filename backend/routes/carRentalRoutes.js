const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/emailAdminAuth");
const {
  createRental,
  getUserRentals,
  updateRentalStatus,
  updatePaymentStatus,
  carRentalDashboard,
  getPendingRentalsWithPayment,
} = require("../controllers/carRentalController");
const roleAuth = require("../middleware/roles");

router.post("/", authMiddleware, createRental);
router.get("/user", authMiddleware, getUserRentals);
router.get("/dashboard", authMiddleware, roleAuth("admin"), adminMiddleware, carRentalDashboard);
router.put("/:rentalId/status", authMiddleware, updateRentalStatus);
router.put("/:rentalId/payment", authMiddleware, updatePaymentStatus);
router.get(
  "/pending-with-payment",
  authMiddleware,
  roleAuth(["admin"]),
  adminMiddleware,
  getPendingRentalsWithPayment
);

module.exports = router;
