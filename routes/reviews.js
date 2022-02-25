const express = require("express");
const router = express.Router();
const loginValidation = require("../validation/validation.js");
//localhost:3000/reviews/
router.get("/", (req, res) => {
	res.send("You performed a GET request to the reviews.");
});

router.post("/add", async (req, res) => {});

module.exports = router;
