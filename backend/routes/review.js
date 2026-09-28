const express = require("express");
// mergeParams keeps :id from the parent listings route available here.
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const validate = require("../middleware/validate.js");
const { reviewSchema } = require("../schemas/index.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware/auth.js");
const reviews = require("../controllers/review.js");

router.post("/", isLoggedIn, validate(reviewSchema), wrapAsync(reviews.create));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.destroy));

module.exports = router;
