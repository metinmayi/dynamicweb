const Joi = require("joi");

const login = (username, password) => {
  const login = {
    username: username,
    password: password,
  };
  const schema = new Joi.object({
    username: Joi.string().min(1).max(12).required(),
    password: Joi.string().required(),
  });
  return schema.validate(login);
};

const register = (body) => {
  const register = {
    username: body.username,
    password: body.password,
    confirmPassword: body.confirmPassword,
  };
  const schema = new Joi.object({
    username: Joi.string().min(1).max(12).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });
  return schema.validate(register);
};

const rating = (ratingObject) => {
  const schema = new Joi.object({
    id: Joi.string().required(),
    rating: Joi.number().less(6).required().greater(0),
  });
  return schema.validate(ratingObject);
};

const restaurant = (restaurantObject) => {
  const schema = new Joi.object({
    imageUrl: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    reviews: Joi.number().required(),
    comments: Joi.array().required(),

    totalRating: Joi.number().required(),
    averageRating: Joi.number().required(),
    creator: Joi.string().required(),
  });

  return schema.validate(restaurantObject);
};

const edit = (id, data) => {
  data["id"] = id;
  const schema = new Joi.object({
    id: Joi.string().required(),
    name: Joi.string().allow(""),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
  });

  return schema.validate(data);
};

const addComment = (data) => {
  const schema = new Joi.object({
    id: Joi.string().required(),
    comment: Joi.string(),
    username: Joi.string().required(),
  });

  return schema.validate(data);
};

const addRating = (id, rating) => {
  const data = { id: id, rating: rating };
  const schema = new Joi.object({
    id: Joi.string().required(),
    rating: Joi.number().less(6).required(),
  });

  return schema.validate(data);
};

exports.register = register;
exports.login = login;
exports.restaurant = restaurant;
exports.rating = rating;
exports.edit = edit;
exports.addComment = addComment;
exports.addRating = addRating;
