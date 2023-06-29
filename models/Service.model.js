const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");

const serviceModel = new Schema(
    {
        picture:{
            type: String,
        },
        speciality:{
            type: String,
            required: true,
        },
        place:{
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amountOfPeople:{
            type:Number,
            required: true,
            min: 1,
        },
        pricePerPerson:{
            type: Number,
            required: true,
        },
        totalPrice:{
        type: Number,
            required: true,
        },
        date:{
            type: Date,
            required: true,
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Service", serviceModel)