function validateDestination(req, res, next) {
  const { destination, country, priority } = req.body;
  
  if (!destination || !destination.trim()) {
    return res.status(400).json({ message: "Destination is required" });
  }
  
  if (!country || !country.trim()) {
    return res.status(400).json({ message: "Country is required" });
  }
  
  if (priority && !["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, medium, or high" });
  }
  
  req.body.destination = destination.trim();
  req.body.country = country.trim();
  req.body.notes = req.body.notes ? req.body.notes.trim() : "";
  
  next();
}

module.exports = { validateDestination };