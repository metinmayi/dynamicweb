const express = require("express");
const router = express.Router();
const validation = require("../validation/validation.js");
const db = require("../db/db.js");
//localhost:3000/restaurants/
router.get("/", async (req, res) => {
  const restaurants = await db.getRestaurants();
  res.send(restaurants);
});

router.get("/add", (req, res) => {
  res.render("restaurants/review-create");
});

//Creates a new restaurant
router.post("/add", async (req, res) => {
  //Creates and object based on the request body.
  const restaurantObject = {
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    reviews: 0,
    comments: [],
    totalRating: 0,
    averageRating: 0,
  };
  //Validates the object
  const result = await validation.restaurant(restaurantObject);
  //If the object validation returns an error, send the error to the user.
  if (result.error) return res.status(400).send(result.error.message);
  //If it does not return error, send the object to the database.
  const addedReview = await db.addRestaurant(restaurantObject);
  res.send("Your restaurant has been added!");
});

// Single page
router.get("/:id", async (req, res) => {
  const result = await db.getRestaurants().findById(req.params.id).lean();

  res.render("resturants/review-single", result);
});

//Rates a restaurant
router.post("/rate/", async (req, res) => {
  await db.setRating(req.body.id, req.body.rating);
  const result = await validation.rating(req.body.mongoID, req.body.rating);
  if (result.error) return res.status(400).send("Invalid Payload");
  res.send("Good job");
});

//Deletes a restaurant
router.post("/delete/:id", async (req, res) => {
  const result = await db.deleteRestaurant(req.params.id);
  res.send(result);
});

module.exports = router;
