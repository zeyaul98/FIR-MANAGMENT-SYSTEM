const express = require("express");
const { searchFIRs } = require("../controllers/searchController");
const { verifyToken } = require("../authMiddleware");

const router = express.Router();

router.get("/", verifyToken, searchFIRs);

module.exports = router;
