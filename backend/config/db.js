const mongoose = require("mongoose");

module.exports = async function connectDB() {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error("MONGO_URL is not set. Copy .env.example to .env first.");
    }
    await mongoose.connect(url);
    console.log("MongoDB connected");
};
