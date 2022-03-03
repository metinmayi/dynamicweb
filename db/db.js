const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ObjectId } = require("mongodb");
const { review, restaurant } = require("../validation/validation");
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

//Function to get a specific restaurant
const getSpecificRestaurant = async (id) => {
  try {
    const myId = ObjectId(id);
    return await client
      .db("grupparbete")
      .collection("restaurants")
      .findOne({ _id: myId });
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

const editRestaurant = async (body) => {
  const object = {};
  if (body.name) object["name"] = body.name;
  if (body.description) object["description"] = body.description;
  if (body.image) object["image"] = body.image;
  console.log(object);
  try {
    const mongoID = new ObjectId(body.id);
    const editRestaurant = await client
      .db("grupparbete")
      .collection("restaurants")
      .updateOne({ _id: mongoID }, { $set: object });

    return editRestaurant;
  } catch (error) {
    return `${error.name}: ${error.message}`;
  }
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

exports.getSpecificRestaurant = getSpecificRestaurant;
exports.getRestaurants = getRestaurants;
exports.getSpecificRestaurant = getSpecificRestaurant;
exports.addRestaurant = addRestaurant;
exports.editRestaurant = editRestaurant;
exports.deleteRestaurant = deleteRestaurant;
exports.setRating = setRating;
