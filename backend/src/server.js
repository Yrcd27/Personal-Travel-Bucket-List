// backend/src/server.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const destinationRoutes = require("./routes/destinations");
const { apiLimiter, authLimiter, securityHeaders } = require("./middleware/security");
require("dotenv").config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.CORS_ORIGIN?.split(",") || []
    : process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Routes (rate limiting disabled for development)
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);

// Error handling middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
