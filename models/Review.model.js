const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");

const reviewSchema = new Schema (
  {
    description: String,
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service"
    },
    rating: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }

);

module.exports = model("Review", reviewSchema);
