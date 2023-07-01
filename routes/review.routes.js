const  mongoose  = require("mongoose");
const router = require("express").Router();
const Service = require("../models/Service.model");
const ReviewModel = require("../models/Review.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.post("/reviews", isAuthenticated, (req, res, next) => {
  const { description, serviceId } = req.body;

  console.log("is this the service Id", req.payload.name);

  const newReview = {
    description: description,
    serviceId: serviceId,
  };


  ReviewModel.create(newReview)
    .then(review => {
      console.log(review, "tell what is this");
      return Service.findByIdAndUpdate(serviceId, {$push: {reviews: review._id }},  {returnDocument: 'after'})
    })
    .then(response => res.status(201).json(response))
    .catch(err => {
      console.log("error creating the review", err);
      res.status(500).json({
        message: "error creating the review",
        error: err
      })
    })
});

router.get("/reviews", isAuthenticated, (req, res, next) => {
  ReviewModel.find()
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      console.log("error getting the list of reviews", err);
      res.status(500).json({
        message: "error getting the list of reviews",
        error: err
      })
    })
} );

router.get('/reviews/:reviewId', (req, res, next) => {
    
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  ReviewModel.findById(reviewId)
      .then(review => res.json(review))
      .catch(err => {
          console.log("error getting details of a project", err);
          res.status(500).json({
              message: "error getting details of a project",
              error: err
          });
      })
});

router.put('/reviews/:reviewId', (req, res, next) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  const newDetails = { description: req.body.description }

  ReviewModel.findByIdAndUpdate(reviewId, newDetails, { new: true })
      .then((updateReview) => res.json(updateReview))
      .catch(err => {
          console.log("error updating project", err);
          res.status(500).json({
              message: "error updating project",
              error: err
          });
      })
});


router.delete('/reviews/:reviewId', (req, res, next) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  ReviewModel.findByIdAndRemove(reviewId)
      .then(() => res.json({ message: `Project with id ${reviewId} & all associated tasks were removed successfully.` }))
      .catch(err => {
          console.log("error deleting project", err);
          res.status(500).json({
              message: "error deleting project",
              error: err
          });
      })
});

module.exports = router;