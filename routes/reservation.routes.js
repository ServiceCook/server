const router = require("express").Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Reservation = require("../models/Reservation.model");
const Service = require("../models/Service.model");
// const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Transporter code
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});


router.post("/services/:serviceId/reserve", isAuthenticated, (req, res, next) => {
  const { serviceId } = req.params;

  console.log(serviceId);
  
  const {fullName, totalPerson, pricePerPerson, date, hour} = req.body;

  if(!mongoose.Types.ObjectId.isValid(serviceId)) {
    res.status(400).json({message: 'specific id is not valid'})
    return;
  }

  Service.findById(serviceId)
    .populate({path: "owner", select: "-password"})
    .then(service => {
        // console.log(service.owner.email, "this is the email of service's owner")
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
        hour: hour
      });

      newReservation.save()
        .then(savedReservation => {

          // console.log(req.payload.address, "tell me this address") ;
          res.status(201).json(savedReservation)
          const ownerEmail = service.owner.email;

          const html = `
            <h2>Below are the details of your new reservation:</h2>
            <p><strong>Order by:</strong> ${req.payload.name}</p>
            <p><strong>User Email:</strong> <strong>${req.payload.email}</strong> </p>
            <p><strong>Total Persons:</strong> ${savedReservation.totalPerson}</p>
            <p><strong>Address:</strong> ${req.payload.address}</p>
            <p><strong>Date:</strong> ${savedReservation.date}</p>
            <p><strong>Hour:</strong> ${savedReservation.hour}</p>
            <p><strong>Price Per Person:</strong> ${savedReservation.pricePerPerson} €</p>
            <p><strong>Total Price:</strong> ${savedReservation.totalPrice} €</p>
            <p><strong>Service by:</strong> ${service.owner.name} €</p>
            <br />
            <p><strong>Noted:</strong> If you have some detailed requirements, please email this owner at ${ownerEmail}!</p>
            <br /> <br /> <br />
            <p>Best regards,</p>
            <h4>Chef On The Way</h4>
            <h4>Pierre Docquin and Solideo Zendrato</h4>
            <p><strong>chefontheway003@gmail.com</strong></p>
          `;

          // // Send email to the owner
          const mailOptions = {
            from: "chefontheway003@gmail.com",
            to: `${ownerEmail}, ${req.payload.email}`, 
            subject: "Reservation",
            html: html
          }

          console.log(html, "html");

          transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              console.error("Error sending welcome email", error)
            } else {
              console.log("Welcome email sent:", info.response)
            }
          })


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


router.get("/reservations/all", isAuthenticated, (req, res, next) => {
  Reservation.find({})
    .populate({
      path: "service",
      populate: {
        path: "owner",
        select: "email"
      }
    })
    .populate("user", "-password")
    .then(reservations => {
      res.json(reservations);
    })
    .catch(err => {
      console.log("Failed to fetch reservations", err);
      res.status(500).json({
        message: "Failed to fetch reservations",
        error: err
      });
    });
});



router.get("/reservations/:reservationId", isAuthenticated, (req, res, next) => {
  const { reservationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Reservation.findById(reservationId)
    .populate({
      path: "service",
      populate: {
        path: "owner",
        select: "email"
      }
    })
    .populate("user", "-password")
    .then(reservation => {
      if (!reservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      const ownerEmail = reservation.service.owner.email;
      console.log(ownerEmail);
      // Use the owner's email

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
  const { fullName, totalPerson, pricePerPerson, date, hour } = req.body;

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
      date: date,
      hour: hour
    },
    { new: true }
  )
    .populate({
      path: "service",
      populate: {
        path: "owner",
        select: "email"
      }
    })
    .populate("user", "-password")
    .then(updatedReservation => {
      if (!updatedReservation) {
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      const ownerEmail = updatedReservation.service.owner.email;
      const userEmail = updatedReservation.user.email;

      const html = `
        <h2>Your reservation has been updated:</h2>
        <p><strong>Order by:</strong> ${updatedReservation.user.name}</p>
        <p><strong>User Email:</strong> <strong>${userEmail}</strong> </p>
        <p><strong>Total Persons:</strong> ${updatedReservation.totalPerson}</p>
        <p><strong>Address:</strong> ${updatedReservation.user.address}</p>
        <p><strong>Date:</strong> ${updatedReservation.date}</p>
        <p><strong>Hour:</strong> ${updatedReservation.hour}</p>
        <p><strong>Price Per Person:</strong> ${updatedReservation.pricePerPerson} €</p>
        <p><strong>Total Price:</strong> ${updatedReservation.totalPrice} €</p>
        <p><strong>Service by:</strong> ${updatedReservation.fullName} </p>
        <br />
        <p><strong>Noted:</strong> If you have some detailed requirements, please email the owner at ${ownerEmail}!</p>
        <br /> <br /> <br />
        <p>Best regards,</p>
        <h4>Chef On The Way</h4>
        <h4>Pierre Docquin and Solideo Zendrato</h4>
        <p><strong>chefontheway003@gmail.com</strong></p>
      `;

      // Send email to the owner and user
      const mailOptions = {
        from: "chefontheway003@gmail.com",
        to: `${ownerEmail}, ${userEmail}`,
        subject: "Updated Reservation",
        html: html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending updated reservation email", error);
        } else {
          console.log("Updated reservation email sent:", info.response);
        }
      });

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