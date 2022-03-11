require("../passport.js");

const express = require("express");
const db = require("../db/db.js");
const router = express.Router();
const loginValidation = require("../validation/validation.js");
const utils = require("../utils.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");

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

//Login-page
router.get("/login", (req, res) => {
  res.render("users/login-register");
});

//Login and register
router.post("/login", async (req, res) => {
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

//Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//Logout
router.post("/logout", async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

module.exports = router;
