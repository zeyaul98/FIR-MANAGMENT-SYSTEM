const express = require("express");
const router = express.Router();
const multer = require("multer");

const { verifyToken, verifyRole } = require("../authMiddleware");

const {
  getOfficerDashboard,
  createFIR,
  getDistricts,
  getThanasByDistrict,
  uploadFIRCSV,
  uploadAccusedCSV,
  uploadAccusedStatusCSV,
  uploadBailerCSV,
  getOfficerFIRs,
  getOfficerFIRById,
  updateOfficerFIR,
  deleteOfficerFIR,
  getOfficerAccusedList,
  getOfficerBailers,
  getBailerById,
  deleteBailer,
  updateOfficerProfile,
  changeOfficerPassword,
} = require("../controllers/officerdashboardController");

const upload = multer({ dest: "uploads/" });

// Officer dashboard
router.get(
  "/dashboard",
  verifyToken,
  verifyRole(["officer"]),
  getOfficerDashboard
);

// Create FIR
router.post(
  "/fir",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("attachment"),
  createFIR
);


router.post(
  "/fir/upload-csv",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("csv"),
  uploadFIRCSV
);

router.post(
  "/accused/upload-csv",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("csv"),
  uploadAccusedCSV
);

router.post(
  "/accused-status/upload-csv",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("csv"),
  uploadAccusedStatusCSV
);

router.post(
  "/bailer/upload-csv",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("csv"),
  uploadBailerCSV
);


router.get("/districts", verifyToken, verifyRole(["officer"]), getDistricts);

router.get(
  "/thanas/:districtId",
  verifyToken,
  verifyRole(["officer"]),
  getThanasByDistrict,
);


// FIR list
router.get(
  "/firs",
  verifyToken,
  verifyRole(["officer"]),
  getOfficerFIRs
);

// Single FIR view
router.get(
  "/firs/:id",
  verifyToken,
  verifyRole(["officer"]),
  getOfficerFIRById
);

// Update FIR
router.put(
  "/firs/:id",
  verifyToken,
  verifyRole(["officer"]),
  upload.single("attachment"),
  updateOfficerFIR
);

// Delete FIR
router.delete(
  "/firs/:id",
  verifyToken,
  verifyRole(["officer"]),
  deleteOfficerFIR
);


router.get(
  "/accused",
  verifyToken,
  verifyRole(["officer"]),
  getOfficerAccusedList
);


router.put(
  "/profile",
  verifyToken,
  verifyRole(["officer"]),
  updateOfficerProfile
);

router.put(
  "/change-password",
  verifyToken,
  verifyRole(["officer"]),
  changeOfficerPassword
);

router.get("/bails", verifyToken, verifyRole(["officer"]), getOfficerBailers);

router.get("/bails/:id", verifyToken, verifyRole(["officer"]), getBailerById);

router.put("/bails/:id", verifyToken, verifyRole(["officer"]), upload.single("attachment"), updateOfficerFIR);

router.delete("/bails/:id", verifyToken, verifyRole(["officer"]), deleteBailer);

module.exports = router;