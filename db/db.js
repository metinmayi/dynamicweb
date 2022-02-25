const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_TOKEN);
client.connect(async (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("Database is connected");
});

const db = {
	async addReview() {},
	async editReview() {},
	async deleteReview() {},
	async setRating() {},
};

module.exports = db;
