const { mongoose, Schema, model } = require("mongoose");

const profileSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    nationality: {
      type: String,
      required: true
    },

    age: Number,
    speciality: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = model("Profile", profileSchema)
