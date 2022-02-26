const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();
const { MongoClient, ObjectId } = require("mongodb");
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
	try {
		return await client
			.db("grupparbete")
			.collection("restaurants")
			.find({})
			.toArray();
	} catch (error) {
		return error.message;
	}
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
		return error.message;
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
		return error.message;
	}
};

const register = async (username, password, email) => {
	try {
		//Look if there's an user with that username already
		const nameExists = await client
			.db("grupparbete")
			.collection("users")
			.findOne({ username: username.toLowerCase() });
		if (nameExists) return "That username already exists";
		//Encrypts the password and tries to create the new user.

		const hashedPassword = await bcrypt.hash(password, 10);
		await client.db("grupparbete").collection("users").insertOne({
			username: username.toLowerCase(),
			password: hashedPassword,
			email: email,
		});
		return "Your user has been created";
	} catch (error) {
		return error.message;
	}
};
exports.getRestaurants = getRestaurants;
exports.addRestaurant = addRestaurant;
exports.editRestaurant = editRestaurant;
exports.deleteRestaurant = deleteRestaurant;
exports.setRating = setRating;
exports.register = register;
