const express = require("express");
const router = express.Router();
const validation = require("../validation/validation.js");
const db = require("../db/db.js");
const { mongoClient } = require("mongodb");
const { getUniqueFilename } = require("../utils.js");

//localhost:3000/restaurants/
router.get("/", async (req, res) => {
  const restaurants = await db.getRestaurants();
  res.send(restaurants);
});

router.get("/mypage", (req, res) => {
  res.render("restaurants/myPage");
});

//Creates a new restaurant
router.post("/mypage/add", async (req, res) => {
  //Creates and object based on the request body.
  const image = req.files.image;
  const filename = getUniqueFilename(image.name);
  const uploadPath = __dirname + "/public/uploads/" + filename;

  await image.mv(uploadPath);

  const restaurantObject = {
    imageUrl: "/uploads/" + filename,
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
  res.redirect(`/${addedReview._id}`);
});

// Single page
router.get("/:id", async (req, res) => {
  const restaurant = await db.getSpecificRestaurant(req.params.id);

  console.log(req.params.id);

  console.log(restaurant);

  res.render("restaurants/review-single", restaurant);
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
  res.render("/restaurants/review-single", result);
});
//Edits a restaurant
router.post("/edit", async (req, res) => {
  const validationResult = await validation.edit(req.body);
  if (validationResult.error) {
    return res.send(validationResult.error.message);
  }
  const result = await db.editRestaurant(req.body);
  res.send(result);
  // res.render("/restaurants/review-mypage-single", result);
});

module.exports = router;
