const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// MIDDLEWARE
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://your-frontend.onrender.com']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// DATABASE
connectDB();

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/officer", require("./routes/officerRoutes"));
app.use("/api/officer", require("./routes/officerRoutes"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Railway FIR Backend Running", env: process.env.NODE_ENV || 'development' });
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// SERVER
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the process using it or set a different PORT.`);
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});