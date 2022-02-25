const Joi = require("joi");

const loginValidation = new Joi.object({
	username: Joi.string().min(1).max(12).required(),
	password: Joi.string().required(),
});

const registerValidation = new Joi.object({
	username: Joi.string().min(1).max(12).required(),
	password: Joi.string().required(),
	email: Joi.email().required(),
});

const reviewValdidation = new Joi.object({
	image: Joi.string().required(),
	description: Joi.string().required(),
	rating: Joi.number().min(1).max(0),
});
