const {mongoose, Schema, model } = require("mongoose");

const serviceModel = new Schema(
    {
        pictures:{
            type: String,
        },
        prestation:{
            type: String,
            required: true,
        },
        place:{
            type: String,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        AmountOfPeople:{
            type:Number,
            required: true,
            min: 1,
        },
        priceByPerson:{
            type: Number,
            required: true,
        },
        date:{
            type: Date,
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true
    }
)

module.export = model("Service", serviceModel)