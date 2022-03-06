const express = require("express");
const { engine } = require("express-handlebars");
const restaurantsRoute = require("./routes/restaurants.js");
const usersRoute = require("./routes/users.js");
const app = express();
const db = require("./db/db.js");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(cookieparser());
app.use(fileUpload());

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);

    res.locals.loggedIn = true;
    res.locals.username = tokenData.username ?? tokenData.displayName;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  async (req, res) => {
    const googleId = req.user.id;

    const user = await db.getUsers(googleId);
    const userData = { displayName: req.user.displayName };

    if (user) {
      userData.id = user._id;
    } else {
      const newUser = {
        googleId,
      };

      await db.addUser(newUser);

      userData.id = newUser._id;
    }
    const token = jwt.sign(userData, process.env.JWTSECRET);

    return res.cookie("token", token).redirect("/");
  }
);
//Routes
app.use("/restaurants", restaurantsRoute);
app.use("/users", usersRoute);

app.get("/", async (req, res) => {
  const restaurants = await db.getRestaurants();

  res.render("home", { restaurants });
});

app.use("/", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(3000, () => {
  console.log("Server is up");
});
