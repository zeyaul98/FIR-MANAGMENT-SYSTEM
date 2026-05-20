let jwt;
try {
  jwt = require("jsonwebtoken");
} catch (err) {
  console.error("jsonwebtoken module not installed!");
  jwt = null;
}

const verifyToken = (req, res, next) => {
  if (!jwt) {
    return res.status(500).json({
      success: false,
      message: "JWT module not installed",
    });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this resource",
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
