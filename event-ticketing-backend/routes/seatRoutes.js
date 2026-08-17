const express = require("express");

const {
    getSeats,
    createSeats
} = require("../controllers/seatController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:eventId", getSeats);

router.post("/", protect, adminOnly, createSeats);

module.exports = router;