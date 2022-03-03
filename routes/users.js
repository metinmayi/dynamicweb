const express = require("express");
const db = require("../db/db.js");
const router = express.Router();
const loginValidation = require("../validation/validation.js");
const utils = require("../utils.js");
const jwt = require("jsonwebtoken");

//localhost:3000/users/
router.post("/register", async (req, res) => {
	const result = await loginValidation.register(req.body);
	if (result.error) return res.status(400).send(result.error.message);

	const user = await db.getUserByUsername(req.body.username);
	if (user) return res.status(400).send("Username already exists");

	if (req.body.password !== req.body.confirmPassword) {
		return res.status(400).send("Passwords don't match");
	}
	const newUser = {
		username: req.body.username,
		hashedPassword: utils.hashPassword(req.body.password),
	};
	await db.addUser(newUser);
	res.status(200).redirect("login");
});

router.get("/login", (req, res) => {
	res.render("users/login-register");
});

router.post("/login", async (req, res) => {
	// Ändrade till loginValidation.login annars hittar den inte funktionen?
	const result = await loginValidation.login(
		req.body.username,
		req.body.password
	);
	if (result.error) return res.status(400).send(result.error.message);

	const user = await db.getUserByUsername(req.body.username);
	if (user && utils.comparePassword(req.body.password, user.hashedPassword)) {
		const userData = { userId: user._id, username: req.body.username };
		const accessToken = jwt.sign(userData, process.env.JWTSECRET);
		return res.cookie("token", accessToken).redirect("/restaurants");
	}
	return res.status(401).send("Incorrect username/password combination.");
});

router.post("/logout", async (req, res) => {
	res.cookie("token", "", { maxAge: 0 });
	res.redirect("/");
});

// router.get("/secret2", forceAuthorize, (req, res) => {
//   res.send("This is a secret page");
// });

module.exports = router;
