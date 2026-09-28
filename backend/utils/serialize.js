// Shapes documents for the API so internal fields (hash, salt, __v) never leak.
const publicUser = (user) =>
    user ? { _id: user._id, username: user.username, email: user.email } : null;

const publicReview = (review) => ({
    _id: review._id,
    comment: review.comment,
    rating: review.rating,
    createdAt: review.createdAt,
    author: review.author && review.author.username ? publicUser(review.author) : review.author,
});

const publicListing = (listing) => ({
    _id: listing._id,
    title: listing.title,
    description: listing.description,
    image: listing.image,
    price: listing.price,
    location: listing.location,
    country: listing.country,
    createdAt: listing.createdAt,
    owner:
        listing.owner && listing.owner.username
            ? publicUser(listing.owner)
            : listing.owner,
    reviews: Array.isArray(listing.reviews)
        ? listing.reviews.filter((r) => r && r.comment).map(publicReview)
        : [],
});

module.exports = { publicUser, publicReview, publicListing };
