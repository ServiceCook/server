const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");

const reservationModel = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true
        },
        service:{
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        totalPerson: {
            type: Number,
            required: true
        },
        pricePerPerson: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Reservation", reservationModel)