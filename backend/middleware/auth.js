const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Every check below runs on the server. The React app hides UI it cannot
// use, but the API is the thing that actually enforces permissions.

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new ExpressError(401, "You must be logged in to do that."));
    }
    next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).select("owner");
    if (!listing) throw new ExpressError(404, "Listing not found.");
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        throw new ExpressError(403, "You can only change your own listings.");
    }
    next();
});

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId).select("author");
    if (!review) throw new ExpressError(404, "Review not found.");
    if (!review.author || !review.author.equals(req.user._id)) {
        throw new ExpressError(403, "You can only delete your own reviews.");
    }
    next();
});
