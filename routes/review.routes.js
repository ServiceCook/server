const { mongoose } = require("mongoose");
const router = require("express").Router();
const Review = require("../models/Review.model");
const Service = require("../models/Service.model");

router.post("/reviews", (req, res, next) => {
  const { description, serviceId } = req.body;

  const newReview = {
    description: description,
    serviceId: serviceId
  };

  Review.create(newReview)
    .then(review => {
      return Service.findByIdAndUpdate(serviceId, {$push: {review: review._id }})
    })
    .then(response => res.status(201).json(response))
    .catch(err => {
      console.log("error creating the review", err);
      res.status(500).json({
        message: "error creating the review",
        error: err
      })
    })
})