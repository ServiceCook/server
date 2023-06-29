const router = require("express").Router();
const mongoose = require("mongoose");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/services/:serviceId/reserve", isAuthenticated, (req, res, next) => {
  const { serviceId } = req.params;

  const {fullName, totalPerson, pricePerPerson, date} = req.body;

  if(!mongoose.Types.ObjectId.isValid(serviceId)) {
    res.status(400).json({message: 'specific id is not valid'})
    return;
  }

  Service.findById(serviceId)
    .then(service => {
        console.log(service)
      if(!service) {
        res.status(400).json({message: 'service not found'})
        return;
      };

      const newReservation = new Reservation({
        service: serviceId,
        user: req.payload,
        fullName: fullName,
        totalPerson: totalPerson,
        pricePerPerson: pricePerPerson,
        totalPrice: (totalPerson * pricePerPerson),
        date: date,
      });

      newReservation.save()
        .then(savedReservation => {
          res.status(201).json(savedReservation)
        })
        .catch(err => {
          console.log("failed to make a new reservation", err);
          res.status(500).json({
            message: 'failed to make a new reservation',
            error: err
          }) 
        })
    })
    .catch(err => {
      console.log("failed to find the id service");
      res.status(500).json({
        message: 'failed to find the id service',
        error: err
      })
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