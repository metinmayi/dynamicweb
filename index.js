const express = require("express");
const reviewsRoute = require("./routes/reviews.js");
const usersRoute = require("./routes/users.js");
const app = express();

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
app.use("/reviews", reviewsRoute);
app.use("/users", usersRoute);
