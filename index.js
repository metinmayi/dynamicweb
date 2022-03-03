const express = require("express");
const { engine } = require("express-handlebars");
const restaurantsRoute = require("./routes/restaurants.js");
const usersRoute = require("./routes/users.js");
const app = express();
const db = require("./db/db.js");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
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
    res.locals.username = tokenData.username;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

//Routes
app.use("/restaurants", restaurantsRoute);
app.use("/users", usersRoute);

app.get("/", async (req, res) => {
  res.render("home");
});

app.use("/", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(3000, () => {
  console.log("Server is up");
});
