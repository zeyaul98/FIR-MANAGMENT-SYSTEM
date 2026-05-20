const express = require("express");

const router = express.Router();

const {
  loginUser,
} = require("../controllers/authController");

const { verifyToken } = require("../authMiddleware");

// LOGIN ROUTE
router.post("/login", loginUser);

// PROTECTED TEST ROUTE (for verification)
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;