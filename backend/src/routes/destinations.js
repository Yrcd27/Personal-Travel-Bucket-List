const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");
const { validateDestination } = require("../middleware/validation");

// GET /api/destinations - Get all destinations for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM destinations WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.sub]
    );
    res.json({ destinations: rows });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/destinations - Create new destination
router.post("/", authenticateToken, validateDestination, async (req, res) => {
  try {
    const { destination, country, notes, priority, visited } = req.body;
    
    const [result] = await pool.query(
      "INSERT INTO destinations (user_id, destination, country, notes, priority, visited) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.sub, destination, country, notes || "", priority || "medium", visited || false]
    );
    
    const [newDestination] = await pool.query(
      "SELECT * FROM destinations WHERE id = ?",
      [result.insertId]
    );
    
    res.status(201).json({ destination: newDestination[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/destinations/:id - Update destination
router.put("/:id", authenticateToken, validateDestination, async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, country, notes, priority, visited } = req.body;
    
    // Check if destination belongs to user
    const [existing] = await pool.query(
      "SELECT id FROM destinations WHERE id = ? AND user_id = ?",
      [id, req.user.sub]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    await pool.query(
      "UPDATE destinations SET destination = ?, country = ?, notes = ?, priority = ?, visited = ? WHERE id = ?",
      [destination, country, notes || "", priority || "medium", visited || false, id]
    );
    
    const [updated] = await pool.query(
      "SELECT * FROM destinations WHERE id = ?",
      [id]
    );
    
    res.json({ destination: updated[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/destinations/:id - Delete destination
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if destination belongs to user
    const [existing] = await pool.query(
      "SELECT id FROM destinations WHERE id = ? AND user_id = ?",
      [id, req.user.sub]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    await pool.query("DELETE FROM destinations WHERE id = ?", [id]);
    
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/destinations/:id/visited - Toggle visited status
router.patch("/:id/visited", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if destination belongs to user
    const [existing] = await pool.query(
      "SELECT id, visited FROM destinations WHERE id = ? AND user_id = ?",
      [id, req.user.sub]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    const newVisitedStatus = !existing[0].visited;
    
    await pool.query(
      "UPDATE destinations SET visited = ? WHERE id = ?",
      [newVisitedStatus, id]
    );
    
    const [updated] = await pool.query(
      "SELECT * FROM destinations WHERE id = ?",
      [id]
    );
    
    res.json({ destination: updated[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;