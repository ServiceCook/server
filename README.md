# CHEF ON THE WAY APP SERVER

## About
REST API for the Chef On The Way app
- This repo implements the backend REST API (built in Express + MongoDB).
- A repository for with the frontend (React App) can be found here: https://github.com/ServiceCook/client

## Instruction
To run in your computer, follow these steps:
- git clone
- install dependencies: npm install
- install nodemailer : npm install nodemailer (since we use nodemailer to transmit the message)
- install cloudinary: npm install cloudinary multer multer-storage-cloudinary (to allow you to user the cloudinary)
- create .env file with the following environment variables
  - ORIGIN: the origin location (example, ORIGIN=5005),
  - TOKEN_SECRET: used to sign auth token (example, TOKEN_SECRET = mysecrett0ken)
  - CLOUDINARY_NAME = add-your-cloudinary-name
  - CLOUDINARY_KEY = add-your-cloudinary-key
  - CLOUDINARY_SECRET = add-your-cloudinary-secret
  - MAIL_USERNAME= add your valid email
  - MAIL_PASSWORD= add your valid application password (you need to create this password)

## API Endpoints

Auth endpoints
| HTTP verb | Path         | Request Headers| Request body                                                               | Description   |
| --------- | -------------| -------------- | ---------------------------------------------------------------------------| ------------- |
| POST      | /auth/upload | -              | -                                                                          | upload image  |
| POST      | /auth/signup | -              |{email:String, password:String, name:String, address:String, picture:string}| Create Account|
| GET       | /auth/profile| Authorization  | -                                                                          | get profile   |
| POST      | /auth/login  | -              | { email: String, password: String }                                        | Login         |
| GET       | /auth/verify | Authorization  | -                                                                          | Veriy jwt     |

## Profil endpoints
| HTTP verb | Path             | Request Headers| Request body                        | Description       |
| --------- | -------------    | -------------- | ------------------------------------| -------------     |
| GET       | /api/myService   | Authorization  | -                                   | Service Page      |
| POST      | /api/reservation | Authorization  | -                                   | Reservation Page  |


## Reservation endpoints
| HTTP verb | Path                                | Request Headers| Request body                        | Description       |
| --------- | ----------------------------------- | -------------- | ------------------------------------| -------------     |
| POST      | /api/services/:serviceId/reserve    | Authorization  | {fullName, totalPerson, pricePerPerson, date, hour}     | Reserve service      |
| PUT       | /api/reservations/:reservationId    |  Authorization | -                                                      | Get reservation  |
| PUT       | /api/reservations/:reservationId    |  Authorization | {fullName, totalPerson, pricePerPerson, date, hour}     | Edit reservation  |
| DELETE    | /api/reservations/:reservationId    |  Authorization | -                                   | Delete reservation  |


## Review endpoints
| HTTP verb | Path                  | Request Headers| Request body                                                               | Description   |
| --------- | -------------         | -------------- | ---------------------------------------------------------------------------| ------------- |
| POST      | /api/reviews          | Authorization  | { description, serviceId, rating }                                         | Create review |
| GET       | /api/reviews          | -              | -                                                                          | Get review    |
| GET       | /api/reviews/:reviewId| Authorization  | -                                                                          | Get review in details   |
| PUT       | /api/reviews/:reviewId| Authorization  | { description, rating }                                                    | Get review in details   |
| DELETE    | /api/reviews/:reviewId| Authorization  | ------------------  | Delete review     |

## Service endpoints
| HTTP verb | Path                    | Request Headers| Request body                                                               | Description   |
| --------- | ----------------------  | -------------- | ---------------------------------------------------------------------------| ------------- |
| POST      | /api/services           | Authorization  | {picture, speciality, place, description, pricePerPerson, availability } | Create service |
| GET       | /api/services           | -              | -                | Get list of services    |
| GET       | /api/services/:serviceId| -              | -                | Get service in details  |
| PUT       | /api/services/:serviceId| Authorization  | {picture, speciality, place, description, pricePerPerson, availability } | Edit service   |
| DELETE    | /api/services/:serviceId| Authorization  | -                | Delete review     |



## Demo
A demo of the REST API can be found here:https://chef-ontheway.netlify.app/