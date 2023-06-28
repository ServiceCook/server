const router = require("express").Router();
const { mongoose } = require("mongoose");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
const Profile = require("../models/Profile.model");

router.post('/profile', (req, res, next) => {
  const { fullName, nationality, age, speciality } = req.body;

  const newProfile = {
    fullName: fullName,
    nationality: nationality,
    age: age,
    speciality,
  };

  Profile.create(newProfile)
    .then(response => res.status(201).json(response))
    .catch(err => {
      console.log("failed to create the new profile", err),
      res.status(500).json({
        message: "failed to create the new file", 
        error: err
      });
  });

});

router.get('/profile', (req, res, next) => {
  Profile.find()
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