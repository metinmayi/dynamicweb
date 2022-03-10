const express = require("express");
const router = express.Router();
const validation = require("../validation/validation.js");
const db = require("../db/db.js");
const jwt = require("jsonwebtoken");
const { getUniqueFilename } = require("../utils.js");

//localhost:3000/restaurants/
router.get("/", async (req, res) => {
  const restaurants = await db.getRestaurants();

  res.render("home", { restaurants });
});

router.get("/mypage", async (req, res) => {
  const { token } = req.cookies;
  const restaurants = await db.getRestaurants(res.locals.username);

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("restaurants/myPage", { restaurants });
  } else {
    res.send("Login failed!");
  }
});

router.post("/comment/:id", async (req, res) => {
  const commentObject = {
    id: req.params.id,
    comment: req.body.comment,
    username: res.locals.username,
  };
  const validateResult = await validation.addComment(commentObject);
  const restComment = await db.getSpecificRestaurant(req.params.id);

  if (validateResult.error) {
    restComment["error"] = validateResult.error.message;
    restComment["differentUser"] = true;
    return res.status(400).render("restaurants/review-single", restComment);
  }

  await db.addComment(commentObject);

  res.redirect(`/restaurants/${req.params.id}`);
});

//Rates a restaurant
router.post("/rate/:id", async (req, res) => {
  const result = await validation.addRating(req.params.id, req.body.rating);
  const restaurant = await db.getSpecificRestaurant(req.params.id);

  if (result.error) {
    restaurant["error"] = result.error.message;
    restaurant["differentUser"] = true;
    return res.status(400).render("restaurants/review-single", restaurant);
  }
  await db.setRating(req.params.id, req.body.rating);

  res.redirect(`/restaurants/${req.params.id}`);
});

//Creates a new restaurant
router.post("/mypage/add", async (req, res) => {
  //Creates and object based on the request body.
  if (!req.files) {
    const restaurants = await db.getRestaurants(res.locals.username);
    return res.status(400).render("restaurants/myPage", {
      error: "Image is missing",
      restaurants,
    });
  }

  const image = req.files.image;
  const filename = getUniqueFilename(image.name);
  const uploadPath = __dirname + "/../public/uploads/" + filename;

  await image.mv(uploadPath);

  const restaurantObject = {
    imageUrl: "/uploads/" + filename,
    name: req.body.name,
    description: req.body.description,
    reviews: 1,
    comments: [],
    totalRating: parseInt(req.body.rating),
    averageRating: parseInt(req.body.rating),
    creator: res.locals.username,
  };

  //Validates the object
  const result = await validation.restaurant(restaurantObject);
  //If the object validation returns an error, send the error to the user.
  if (result.error) {
    const restaurants = await db.getRestaurants(res.locals.username);
    return res.status(400).render("restaurants/myPage", {
      error: result.error.message,
      restaurants,
    });
  }
  //If it does not return error, send the object to the database.
  const addedReview = await db.addRestaurant(restaurantObject);
  res.redirect(`/restaurants/${addedReview.insertedId}`);
});

// Single page
router.get("/:id", async (req, res) => {
  const restaurant = await db.getSpecificRestaurant(req.params.id);
  if (restaurant.creator === res.locals.username) {
    restaurant["sameUser"] = true;
  } else {
    restaurant["differentUser"] = true;
  }
  res.render("restaurants/review-single", restaurant);
});

//Deletes a restaurant
router.post("/delete/:id", async (req, res) => {
  await db.deleteRestaurant(req.params.id);
  res.redirect("/restaurants/mypage");
});
//Edits a restaurant
router.post("/edit/:id", async (req, res) => {
  const restaurant = await db.getSpecificRestaurant(req.params.id);

  if (restaurant.creator === res.locals.username) {
    restaurant["sameUser"] = true;
  } else {
    restaurant["differentUser"] = true;
  }

  if (
    req.files == null &&
    req.body.name.length == 0 &&
    req.body.description.length == 0
  ) {
    return res.status(400).render("restaurants/review-single", {
      error: "Fill out at least one field to edit",
      ...restaurant,
    });
  }

  if (req.files !== null) {
    const image = req.files.image;
    const filename = getUniqueFilename(image.name);
    const uploadPath = __dirname + "/../public/uploads/" + filename;

    await image.mv(uploadPath);
    req.body["image"] = "/uploads/" + filename;
  }

  await db.editRestaurant(req.params.id, req.body);
  res.redirect("/restaurants/" + req.params.id);
});

module.exports = router;
