const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=70";

const listingSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: {
            // `filename` stores the Cloudinary public_id so the asset can be
            // destroyed when the listing is deleted or the image replaced.
            filename: { type: String, default: "listingimage" },
            url: { type: String, default: DEFAULT_IMAGE },
        },
        price: { type: Number, required: true, min: 0 },
        location: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// Text index powers the search box on the listings page.
listingSchema.index({ title: "text", location: "text", country: "text" });

// Cascade-delete reviews when a listing is removed.
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
module.exports.DEFAULT_IMAGE = DEFAULT_IMAGE;
