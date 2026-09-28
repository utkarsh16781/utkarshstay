const Joi = require("joi");

// Multipart form fields arrive as strings, so numbers are coerced by Joi.
const listingSchema = Joi.object({
    title: Joi.string().trim().min(3).max(120).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 3 characters.",
    }),
    description: Joi.string().trim().min(10).max(4000).required().messages({
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 10 characters.",
    }),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
    }),
    location: Joi.string().trim().min(2).max(120).required().messages({
        "string.empty": "Location is required.",
    }),
    country: Joi.string().trim().min(2).max(120).required().messages({
        "string.empty": "Country is required.",
    }),
    // Optional fallback when no file is uploaded.
    imageUrl: Joi.string().uri().allow("", null),
});

const reviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Choose a rating from 1 to 5.",
        "number.min": "Choose a rating from 1 to 5.",
        "number.max": "Choose a rating from 1 to 5.",
    }),
    comment: Joi.string().trim().min(3).max(2000).required().messages({
        "string.empty": "Write a short comment.",
    }),
});

const signupSchema = Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
        "string.alphanum": "Username can contain letters and numbers only.",
        "string.empty": "Username is required.",
    }),
    email: Joi.string().trim().email().required().messages({
        "string.email": "Enter a valid email address.",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters.",
    }),
});

const loginSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().required(),
});

module.exports = { listingSchema, reviewSchema, signupSchema, loginSchema };
