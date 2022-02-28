const express = require("express");
const { engine } = require("express-handlebars");
const restaurantsRoute = require("./routes/restaurants.js");
const usersRoute = require("./routes/users.js");
const app = express();
const db = require("./db/db.js");

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
