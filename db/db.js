const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
const { review } = require("../validation/validation");
const client = new MongoClient(process.env.MONGODB_TOKEN);
client.connect(async (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("Database is connected");
});

//Function to add a restaurant to the database
const addRestaurant = async (reviewObject) => {
	try {
		const result = await client
			.db("grupparbete")
			.collection("reviews")
			.insertOne(reviewObject);

		return result;
	} catch (error) {
		return error;
	}
};

const editReview = () => {
	console.log("Drink piss");
};

const deleteReview = () => {};

const setRating = () => {};

exports.addRestaurant = addRestaurant;
exports.editReview = editReview;
exports.deleteReview = deleteReview;
exports.setRating = setRating;
