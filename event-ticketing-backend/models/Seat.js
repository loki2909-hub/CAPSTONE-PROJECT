const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        seatNumber: {
            type: String,
            required: true
        },
        row: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Seat", seatSchema);