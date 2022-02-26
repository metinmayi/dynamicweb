const express = require("express");
const router = express.Router();
const validation = require("../validation/validation.js");
const db = require("../db/db.js");

//localhost:3000/users/

router.get("/login", async (req, res) => {
	const result = await validation.login(req.body.username, req.body.password);
	if (result.error) return res.status(400).send(error.message);

	//INSERT COOKIE HERE
	res.send(req.body);
});

router.get("/logout", async (req, res) => {});

router.post("/register", async (req, res) => {
	//Checks the data validation
	const result = await validation.register(
		req.body.username,
		req.body.password,
		req.body.repeatPassword,
		req.body.email
	);
	if (result.error) return res.status(400).send(result.error.message);
	if (req.body.password != req.body.repeatPassword)
		return res.status(400).send("Your passwords did not match");
	//If validation was good and passwords matches, try to create a new user.
	const registerAttempt = await db.register(
		req.body.username,
		req.body.password,
		req.body.email
	);
	console.log(registerAttempt);
	res.send(registerAttempt);
});

module.exports = router;
