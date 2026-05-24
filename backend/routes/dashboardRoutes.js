const express = require("express");
const {
  getDashboardStats,
  getMonthlyTrend,
  getCaseStatusDistribution,
  getAllAccused,
  getAllBailers,
  getDistrictWiseReport,
  getThanaWiseReport,
  getRepeatOffenders,
  getCustodyStatusReport,
  getDailyFIRReport,
  getMonthlyCrimeReport,
  getAllFIRs,
} = require("../controllers/dashboardController");
const { verifyToken } = require("../authMiddleware");

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/monthly-trend", verifyToken, getMonthlyTrend);
router.get("/case-status", verifyToken, getCaseStatusDistribution);
router.get("/accused", verifyToken, getAllAccused);
router.get("/bailers", verifyToken, getAllBailers);
router.get("/district-report", verifyToken, getDistrictWiseReport);
router.get("/thana-report", verifyToken, getThanaWiseReport);
router.get("/repeat-offenders", verifyToken, getRepeatOffenders);
router.get("/custody-status", verifyToken, getCustodyStatusReport);
router.get("/daily-report", verifyToken, getDailyFIRReport);
router.get("/monthly-report", verifyToken, getMonthlyCrimeReport);
router.get("/firs", verifyToken, getAllFIRs);

module.exports = router;
