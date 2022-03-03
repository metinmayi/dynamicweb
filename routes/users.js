const express = require("express");
const { Db } = require("mongodb");
const db = require("../db/db.js");
const router = express.Router();
const loginValidation = require("../validation/validation.js");
const utils = require("../utils.js");
const jwt = require("jsonwebtoken");

//localhost:3000/users/
router.post("/register", async (req, res) => {
  const result = await loginValidation.register(
    req.body.username,
    req.body.password,
    req.body.confirmPassword
  );

  const user = await db.getUserByUsername(req.body.username);
  if (user) {
    result.error;
    return res.status(400).send("Username already exists");
  } else if (req.body.password !== req.body.confirmPassword) {
    console.log(req.body.password + req.body.confirmPassword);
    return res.status(400).send("Passwords don't match");
  } else {
    const newUser = {
      username: req.body.username,
      hashedPassword: utils.hashPassword(req.body.password),
    };
    console.log(newUser);
    await db.addUser(newUser);
  }
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

  console.log(req.body.username);
  const user = await db.getUserByUsername(req.body.username);
  console.log(user);
  if (user && utils.comparePassword(req.body.password, user.hashedPassword)) {
    const userData = { userId: user._id, username: req.body.username };
    const accessToken = jwt.sign(userData, process.env.JWTSECRET);

    res.cookie("token", accessToken);
    res.render("home", user);
  } else {
    result.error;
    return res.status(400).send("Invalid payload");
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

// router.get("/secret2", forceAuthorize, (req, res) => {
//   res.send("This is a secret page");
// });

module.exports = router;
