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

//Här måste vi ändra så att det går att lämna en rating utan fel + ändra till less(6) istället för 5 på rad 80 i validaiton.js
//Rates a restaurant
router.post("/rate/:id", async (req, res) => {
	// console.log(req.params.id);
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

// Här måste vi ändra så att man är kvar på samma sida när man får fel-meddelandet
//Creates a new restaurant
router.post("/mypage/add", async (req, res) => {
	//Creates and object based on the request body.
	if (!req.files) {
		return res.status(400).render("restaurants/myPage", {
			error: "Image is missing",
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
		reviews: 0,
		comments: [],
		totalRating: 0,
		averageRating: 0,
		creator: res.locals.username,
	};

	//Validates the object
	const result = await validation.restaurant(restaurantObject);
	//If the object validation returns an error, send the error to the user.
	if (result.error)
		return res.status(400).render("restaurants/myPage", {
			error: result.error.message,
		});
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
	const validationResult = await validation.edit(req.params.id, req.body);

	if (validationResult.error)
		return res.status(400).render("restaurants/review-single", {
			error: validationResult.error.message,
		});

	await db.editRestaurant(req.params.id, req.body);
	res.redirect("/restaurants/mypage");
});

module.exports = router;
