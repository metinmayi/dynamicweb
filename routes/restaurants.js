const express = require("express");
const router = express.Router();
const validation = require("../validation/validation.js");
const db = require("../db/db.js");
//localhost:3000/restaurants/
router.get("/", (req, res) => {
	res.send("You performed a GET request to the restaurants.");
});

//Creates a new restaurant
router.post("/add", async (req, res) => {
	//Creates and object based on the request body.
	const restaurantObject = {
		image: req.body.image,
		description: req.body.description,
		reviews: 0,
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

router.post("/rate", async (req, res) => {});

module.exports = router;