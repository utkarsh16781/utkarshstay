// Seeds the database with sample listings owned by a demo user.
// Run with:  npm run seed
require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const initData = require("./data.js");

const DEMO = { username: "demo", email: "demo@utkarshstay.dev", password: "demo1234" };

async function seed() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    await Listing.deleteMany({});
    await Review.deleteMany({});

    let owner = await User.findOne({ username: DEMO.username });
    if (!owner) {
        owner = await User.register(
            new User({ username: DEMO.username, email: DEMO.email }),
            DEMO.password
        );
        console.log(`Created demo user "${DEMO.username}" with password "${DEMO.password}"`);
    }

    const docs = initData.data.map((listing) => ({ ...listing, owner: owner._id }));
    await Listing.insertMany(docs);

    console.log(`Seeded ${docs.length} listings`);
    await mongoose.connection.close();
}

seed().catch(async (err) => {
    console.error("Seed failed:", err.message);
    await mongoose.connection.close();
    process.exit(1);
});
