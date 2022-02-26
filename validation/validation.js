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

const register = (username, password, repeatPassword, email) => {
	const register = {
		username: username,
		password: password,
		repeatPassword: repeatPassword,
		email: email,
	};
	const schema = new Joi.object({
		username: Joi.string().min(1).max(12).required(),
		password: Joi.string().required(),
		repeatPassword: Joi.string().required(),
		email: Joi.string().email().required(),
	});

	return schema.validate(register);
};

const rating = (ratingObject) => {
	const schema = new Joi.object({
		id: Joi.string().required(),
		rating: Joi.number().less(5).required(),
	});
	return schema.validate(ratingObject);
};

const restaurant = (restaurantObject) => {
	const schema = new Joi.object({
		image: Joi.string().required(),
		name: Joi.string().required(),
		description: Joi.string().required(),
		reviews: Joi.number().required(),
		comments: Joi.array().required(),
		totalRating: Joi.number().required(),
		averageRating: Joi.number().required(),
	});

	return schema.validate(restaurantObject);
};

exports.login = login;
exports.restaurant = restaurant;
exports.rating = rating;
exports.register = register;
