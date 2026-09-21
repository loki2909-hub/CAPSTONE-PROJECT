const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const liveEventRoutes = require("./routes/liveEventRoutes");

const app = express();

connectDB();

const configuredOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || "").split(",")
].map((origin) => origin && origin.trim()).filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || configuredOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("CORS origin not allowed"));
    }
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Event Ticketing & Seat Booking Platform Backend is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/live-events", liveEventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
});