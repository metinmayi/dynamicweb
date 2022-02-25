const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ObjectId } = require("mongodb");
const { review } = require("../validation/validation");
const client = new MongoClient(process.env.MONGODB_TOKEN);
client.connect(async (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("Database is connected");
});

//Function to get all restaurants
const getRestaurants = async () => {
	return await client
		.db("grupparbete")
		.collection("restaurants")
		.find({})
		.toArray();
};
//Function to add a restaurant to the database
const addRestaurant = async (reviewObject) => {
	try {
		const result = await client
			.db("grupparbete")
			.collection("restaurants")
			.insertOne(reviewObject);

		return result;
	} catch (error) {
		return error;
	}
};

const editRestaurant = () => {
	console.log("Drink piss");
};

const deleteRestaurant = async (id) => {
	try {
		const mongoID = new ObjectId(id);
		const deletedRestaurant = await client
			.db("grupparbete")
			.collection("restaurants")
			.deleteOne({ _id: mongoID });
		return deletedRestaurant.deletedCount > 0
			? "Deleted the restaurant"
			: "Couldn't find that restaurant";
	} catch (error) {
		return `${error.name}: ${error.message}`;
	}
};

const setRating = async (id, rating) => {
	try {
		const mongoID = new ObjectId(id);
		await client
			.db("grupparbete")
			.collection("restaurants")
			.updateOne({ _id: mongoID }, [
				{
					$set: {
						reviews: {
							$add: ["$reviews", 1],
						},
						totalRating: {
							$add: ["$totalRating", rating],
						},
					},
				},
				{
					$set: {
						averageRating: {
							$round: [{ $divide: ["$totalRating", "$reviews"] }, 2],
						},
					},
				},
			]);
	} catch (error) {
		console.log(error);
	}
};

exports.getRestaurants = getRestaurants;
exports.addRestaurant = addRestaurant;
exports.editRestaurant = editRestaurant;
exports.deleteRestaurant = deleteRestaurant;
exports.setRating = setRating;
