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

router.get("/reservations/:reservationId", isAuthenticated, (req, res, next) => {
  const { reservationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Reservation.findById(reservationId)
    .populate("service")
    .populate("user", "-password")
    .then(reservation => {
      if (!reservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      res.json(reservation);
    })
    .catch(err => {
      console.log("Failed to find the reservation", err);
      res.status(500).json({
        message: "Failed to find the reservation",
        error: err
      });
    });
});


router.put("/reservations/:reservationId", isAuthenticated, (req, res, next) => {
  const { reservationId } = req.params;
  const { fullName, totalPerson, pricePerPerson, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Reservation.findByIdAndUpdate(
    reservationId,
    {
      fullName: fullName,
      totalPerson: totalPerson,
      pricePerPerson: pricePerPerson,
      totalPrice: totalPerson * pricePerPerson,
      date: date
    },
    { new: true }
  )
    .then(updatedReservation => {
      if (!updatedReservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }
      res.json(updatedReservation);
    })
    .catch(err => {
      console.log("Failed to update the reservation", err);
      res.status(500).json({
        message: "Failed to update the reservation",
        error: err
      });
    });
});

router.delete("/reservations/:reservationId", isAuthenticated, (req, res, next) => {
  const { reservationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Reservation.findByIdAndRemove(reservationId)
    .then(deletedReservation => {
      if (!deletedReservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }
      res.json({ message: `Reservation with id ${reservationId} was removed successfully.` });
    })
    .catch(err => {
      console.log("Failed to delete the reservation", err);
      res.status(500).json({
        message: "Failed to delete the reservation",
        error: err
      });
    });
});



module.exports = router;