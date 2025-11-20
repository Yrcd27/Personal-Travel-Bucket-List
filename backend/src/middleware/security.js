const rateLimit = require("express-rate-limit");

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limit
const apiLimiter = createRateLimit(15 * 60 * 1000, 100, "Too many requests, please try again later");

// Auth endpoints rate limit (more lenient for development)
const authLimiter = createRateLimit(15 * 60 * 1000, 50, "Too many authentication attempts, please try again later");

// Security headers middleware
function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
}

module.exports = { apiLimiter, authLimiter, securityHeaders };