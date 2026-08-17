const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Event = require("../models/Event");

const createBooking = async (req, res) => {
    try {
        const { eventId, seatIds } = req.body;

        if (!eventId || !seatIds || seatIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Event and seats are required"
            });
        }

        const seats = await Seat.find({
            _id: { $in: seatIds },
            event: eventId,
            status: "available"
        });

        if (seats.length !== seatIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more seats are unavailable"
            });
        }

        const totalAmount = seats.reduce(
            (total, seat) => total + seat.price,
            0
        );

        const bookingReference =
            "EVT-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000);

        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            seats: seatIds,
            bookingReference,
            totalAmount
        });

        await Seat.updateMany(
            {
                _id: { $in: seatIds }
            },
            {
                $set: { status: "booked" }
            }
        );

        await Event.findByIdAndUpdate(
            eventId,
            {
                $inc: {
                    availableSeats: -seatIds.length
                }
            }
        );

        res.status(201).json({
            success: true,
            message: "Booking successful",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id
        })
            .populate("event")
            .populate("seats")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });
        }

        await Seat.updateMany(
            {
                _id: { $in: booking.seats }
            },
            {
                $set: { status: "available" }
            }
        );

        await Event.findByIdAndUpdate(
            booking.event,
            {
                $inc: {
                    availableSeats: booking.seats.length
                }
            }
        );

        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelBooking
};