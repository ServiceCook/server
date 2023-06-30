const { mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");


const reviewSchema = new Schema (
  {
    description: {
      type: string,
      // required: true 
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service"
    }
  },
  {
    timestamps: true,
  }

);

module.exports = model("Review", reviewSchema);
