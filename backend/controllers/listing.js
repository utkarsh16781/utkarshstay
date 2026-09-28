const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { destroyImage } = require("../config/cloudinary.js");
const { publicListing } = require("../utils/serialize.js");

// GET /api/listings?q=&country=&minPrice=&maxPrice=&sort=&page=
module.exports.index = async (req, res) => {
    const { q, country, minPrice, maxPrice, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 48);

    const filter = {};
    if (q) {
        const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [{ title: rx }, { location: rx }, { country: rx }];
    }
    if (country) filter.country = new RegExp(`^${country}$`, "i");
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
        newest: { createdAt: -1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
    };

    const [listings, total] = await Promise.all([
        Listing.find(filter)
            .sort(sortMap[sort] || sortMap.newest)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("owner", "username"),
        Listing.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: listings.map(publicListing),
        meta: { total, page, pages: Math.ceil(total / limit) || 1 },
    });
};

// GET /api/listings/countries - powers the filter dropdown
module.exports.countries = async (req, res) => {
    const countries = await Listing.distinct("country");
    res.json({ success: true, data: countries.sort() });
};

// GET /api/listings/:id
module.exports.show = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate("owner", "username")
        .populate({ path: "reviews", populate: { path: "author", select: "username" } });

    if (!listing) throw new ExpressError(404, "Listing not found.");
    res.json({ success: true, data: publicListing(listing) });
};

// POST /api/listings
module.exports.create = async (req, res) => {
    const { imageUrl, ...fields } = req.body;
    const listing = new Listing(fields);
    listing.owner = req.user._id;

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    } else if (imageUrl) {
        listing.image = { url: imageUrl, filename: "listingimage" };
    }

    await listing.save();
    await listing.populate("owner", "username");
    res.status(201).json({ success: true, data: publicListing(listing) });
};

// PUT /api/listings/:id
module.exports.update = async (req, res) => {
    const { imageUrl, ...fields } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found.");

    Object.assign(listing, fields);

    const previousId = listing.image && listing.image.filename;
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await destroyImage(previousId);
    } else if (imageUrl && imageUrl !== listing.image.url) {
        listing.image = { url: imageUrl, filename: "listingimage" };
        await destroyImage(previousId);
    }

    await listing.save();
    await listing.populate("owner", "username");
    res.json({ success: true, data: publicListing(listing) });
};

// DELETE /api/listings/:id
module.exports.destroy = async (req, res) => {
    // findByIdAndDelete triggers the post hook that removes the reviews.
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found.");
    await destroyImage(listing.image && listing.image.filename);
    res.json({ success: true, message: "Listing deleted." });
};

// GET /api/listings/mine
module.exports.mine = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id })
        .sort({ createdAt: -1 })
        .populate("owner", "username");
    res.json({ success: true, data: listings.map(publicListing) });
};
