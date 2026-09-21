const express = require("express");
const { getLiveEvents } = require("../controllers/liveEventController");

const router = express.Router();

router.get("/", getLiveEvents);

module.exports = router;
