const router = require("express").Router();
const { mongoose } = require("mongoose");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
const User = require("../models/User.model")

router.get('/user', (req, res, next) => {
  User.find()
    .select("-password")
    .then(response => res.json(response))
    .catch(err => {
      console.log("failed to fetch the profile");
      res.status(500).json({
        message: 'failed to fetch the profile',
        error: err
      });
    });
});

module.exports = router;