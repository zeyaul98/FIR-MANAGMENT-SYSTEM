const express = require("express");
const router = express.Router();
const multer = require("multer");




const { getOfficerDashboard } = require("../controllers/dashboardController");
const { createFIR, uploadFIRCSV } = require('../controllers/dashboardController')
const { getOfficerFIRList } = require("../controllers/dashboardController");
const { getAllFIRs } = require("../controllers/dashboardController");


const upload = multer({ dest: "uploads/" });

router.get("/dashboard", getOfficerDashboard);
router.get("/officer/firs", getOfficerFIRList);
router.post("/fir", upload.single("attachment"), createFIR);
const { getAllAccused } = require("../controllers/dashboardController");



router.get("/firs", getAllFIRs);
router.get("/accused", getAllAccused);
router.post(
  "/fir/upload-csv",
  upload.single("csv"),
  uploadFIRCSV
);


module.exports = router;