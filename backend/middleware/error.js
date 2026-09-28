const ExpressError = require("../utils/ExpressError.js");

module.exports.notFound = (req, res, next) => {
    next(new ExpressError(404, "That endpoint does not exist."));
};

module.exports.errorHandler = (err, req, res, next) => {
    // A malformed :id is a CastError from Mongoose - report it as a 404.
    if (err.name === "CastError") err = new ExpressError(404, "Not found.");
    if (err.name === "ValidationError") {
        err = new ExpressError(
            400,
            Object.values(err.errors).map((e) => e.message).join(" ")
        );
    }
    if (err.code === 11000) err = new ExpressError(409, "That value is already in use.");

    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500 ? "Something went wrong on our end." : err.message;

    if (statusCode === 500) console.error(err);

    res.status(statusCode).json({ success: false, message });
};
