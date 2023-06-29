const router = require("express").Router();
const mongoose = require("mongoose");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/services", isAuthenticated, (req, res, next) => {
  const {picture, speciality, place, description, amountOfPeople, pricePerPerson, totalPrice, date } = req.body;

  console.log("give me something about this", req.payload )

  const newService = {
    picture: picture,
    speciality: speciality,
    place: place,
    description: description,
    amountOfPeople: amountOfPeople,
    pricePerPerson: pricePerPerson,
    totalPrice: totalPrice,
    date: date,
    owner: req.payload._id
  }

  Service.create(newService)
    .then(response => res.status(201).json(response))
    .catch(err => {
        console.log("error creating a new project", err);
        res.status(500).json({
            message: "error creating a new project",
            error: err
        });
    });
});

router.get('/services', (req, res, next) => {
  Service.find()
      .populate({path: "owner", select: "-password"})
      .then(response => {
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


router.get('/services/:serviceId', (req, res, next) => {
    const { serviceId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({message: 'Specified id is not valid'})
    };

    Service.findById(serviceId)
        .then(response => res.json(response))
        .catch(err => {
            console.log("error getting details of service", err)
            res.status(500).json({
                message: 'error getting details of service',
                error: err
            });
        });

});

router.put('/services/:serviceId', (req, res, next) => {
    const { serviceId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({message: 'Specified id is not valid'})
    };

    const newService = {
        picture: req.bodypicture,
        prestation: req.body.prestation,
        place: req.body.place,
        price: req.body.price,
        description: req.body.description,
        amountOfPeople: req.body.amountOfPeople,
        pricePerPerson: req.body.pricePerPerson,
        date: req.body.date,
        // user: []
      }

    Service.findByIdAndUpdate(serviceId, newService, { new: true })
        .then(updateService => res.json(updateService))
        .catch(err => {
            console.log('error updating the service', err)
            res.status(500).json({
                message: 'error updating serive',
                error: err
            })
        })

})

router.delete('/services/:serviceId', (req, res, next) => {
    const { serviceId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({message: 'Specific id is not valid'})
        return;
    }

    Service.findByIdAndRemove(serviceId)
        .then(deleteService => res.json({message: `Service with id ${serviceId} was removed successfully.`}))
        .catch(err => {
            console.log('failed to delete', err);
            res.status(500).json({ message: 'failed to delete', error: err})
        })
})


module.exports = router;