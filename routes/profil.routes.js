const router = require("express").Router();
const mongoose = require("mongoose");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get('/myService', isAuthenticated, (req, res, next) => {
    const userId = req.payload._id
    console.log(userId)
    Service.find({owner: userId})
        .then(response => {
            console.log(response);
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of projects", err);
            res.status(500).json({
                message: "error getting list of projects",
                error: err
            });
        })
  });

  router.get("/reservations", isAuthenticated, (req, res, next) => {
    const userId = req.payload;
  
    console.log(userId);
  
    Reservation.find({ user: userId })
      .populate({ path: "service", select: "serviceName" }) // Populate the service information
      .populate({path: "user", select: "-password"})
      .then(reservations => {
        console.log(reservations);
        res.json(reservations);
      })
      .catch(err => {
        console.log("Failed to retrieve reservations", err);
        res.status(500).json({
          message: "Failed to retrieve reservations",
          error: err
        });
      });
  });


  module.exports = router;