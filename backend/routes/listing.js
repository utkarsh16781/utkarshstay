const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const validate = require("../middleware/validate.js");
const upload = require("../middleware/upload.js");
const { listingSchema } = require("../schemas/index.js");
const { isLoggedIn, isOwner } = require("../middleware/auth.js");
const listings = require("../controllers/listing.js");

// Static paths must be declared before "/:id" or they are swallowed by it.
router.get("/countries", wrapAsync(listings.countries));
router.get("/mine", isLoggedIn, wrapAsync(listings.mine));

router
    .route("/")
    .get(wrapAsync(listings.index))
    .post(
        isLoggedIn,
        upload("image"),       // parses multipart, so it must run before validation
        validate(listingSchema),
        wrapAsync(listings.create)
    );

router
    .route("/:id")
    .get(wrapAsync(listings.show))
    .put(isLoggedIn, isOwner, upload("image"), validate(listingSchema), wrapAsync(listings.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listings.destroy));

module.exports = router;
