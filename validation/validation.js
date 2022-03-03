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

// const registerValidation = new Joi.object({
// 	username: Joi.string().min(1).max(12).required(),
// 	password: Joi.string().required(),
// });

const rating = (ratingObject) => {
	const schema = new Joi.object({
		id: Joi.string().required(),
		rating: Joi.number().less(5).required(),
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
	});

	return schema.validate(restaurantObject);
};

const edit = (data) => {
	const schema = new Joi.object({
		id: Joi.string().required(),
		name: Joi.string(),
		description: Joi.string(),
		image: Joi.string(),
	});

	return schema.validate(data);
};

exports.register = register;
exports.login = login;
exports.restaurant = restaurant;
exports.rating = rating;
exports.edit = edit;
