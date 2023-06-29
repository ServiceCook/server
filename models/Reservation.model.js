const {mongoose, Schema, model } = require("mongoose");

const reservationModel = new Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        service:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
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
    },
    {
        timestamps: true
    }
)

module.exports = model("Reservation", reservationModel)