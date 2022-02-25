const Joi = require("joi");

const loginValidation = (username, password) => {
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

const registerValidation = new Joi.object({
	username: Joi.string().min(1).max(12).required(),
	password: Joi.string().required(),
});

const reviewValdidation = new Joi.object({
	image: Joi.string().required(),
	description: Joi.string().required(),
	rating: Joi.number().min(1).max(0),
});

module.exports = loginValidation;
