const {mongoose, Schema, model } = require("mongoose");

const reservationModel = new Schema(
    {
        // user:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        // },
        // service:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Service"
        // }
        
    },
    {
        timestamps: true
    }
)

module.exports = model("Reservation", reservationModel)