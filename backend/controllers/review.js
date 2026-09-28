const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { publicReview } = require("../utils/serialize.js");

// POST /api/listings/:id/reviews
module.exports.create = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found.");

    const review = new Review(req.body);
    review.author = req.user._id;
    listing.reviews.push(review._id);

    await review.save();
    await listing.save();
    await review.populate("author", "username");

    res.status(201).json({ success: true, data: publicReview(review) });
};

// DELETE /api/listings/:id/reviews/:reviewId
module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review deleted." });
};
