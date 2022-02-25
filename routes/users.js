const express = require("express");
const router = express.Router();
const loginValidation = require("../verification/verification.js");

//localhost:3000/users/
router.get("/login", async (req, res) => {
	const result = await loginValidation(req.body.username, req.body.password);
	if (result.error) return res.status(400).send("Invalid payload");

	//INSERT COOKIE HERE
	res.send(req.body);
});

module.exports = router;
