const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => res.json({ success: true, message: "API is running" }));
router.use("/auth", require("./user.js"));
router.use("/listings/:id/reviews", require("./review.js"));
router.use("/listings", require("./listing.js"));

module.exports = router;
