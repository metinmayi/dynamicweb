const express = require("express");
const router = express.Router();
const loginValidation = require("../validation/validation.js");

//localhost:3000/users/

router.get("/login", (req, res) => {
  res.render("users/login-register");
});

router.post("/login", async (req, res) => {
  // Ändrade till loginValidation.login annars hittar den inte funktionen?
  const result = await loginValidation.login(
    req.body.username,
    req.body.password
  );
  if (result.error) return res.status(400).send("Invalid payload");

  //INSERT COOKIE HERE
  res.send(req.body);
});

router.post("/register", (req, res) => {});

router.get("/logout", async (req, res) => {});

module.exports = router;
