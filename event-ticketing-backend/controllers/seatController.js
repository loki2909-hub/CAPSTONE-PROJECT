const Seat = require("../models/Seat");

const getSeats = async (req, res) => {
    try {
        const seats = await Seat.find({
            event: req.params.eventId
        }).sort({ row: 1, number: 1 });

        res.json({
            success: true,
            seats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createSeats = async (req, res) => {
    try {
        const { eventId, rows, seatsPerRow, price } = req.body;

        const seats = [];

        for (let i = 0; i < rows.length; i++) {
            for (let j = 1; j <= seatsPerRow; j++) {
                seats.push({
                    event: eventId,
                    seatNumber: `${rows[i]}${j}`,
                    row: rows[i],
                    number: j,
                    price,
                    status: "available"
                });
            }
        }

        const createdSeats = await Seat.insertMany(seats);

        res.status(201).json({
            success: true,
            seats: createdSeats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getSeats,
    createSeats
};