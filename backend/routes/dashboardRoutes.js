const express = require("express");
const {
  getDashboardStats,
  getMonthlyTrend,
  getCaseStatusDistribution,
} = require("../controllers/dashboardController");
const { verifyToken } = require("../authMiddleware");

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/monthly-trend", verifyToken, getMonthlyTrend);
router.get("/case-status", verifyToken, getCaseStatusDistribution);

module.exports = router;
