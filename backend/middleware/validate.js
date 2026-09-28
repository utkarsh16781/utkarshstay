const ExpressError = require("../utils/ExpressError.js");

// Validates req.body against a Joi schema and replaces it with the
// sanitised value, so controllers never see unexpected fields.
module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });

    if (error) {
        const message = error.details.map((d) => d.message).join(" ");
        return next(new ExpressError(400, message));
    }

    req.body = value;
    next();
};
