const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const isConfigured = Boolean(
    process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET
);

if (isConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    });
} else {
    console.warn(
        "Cloudinary credentials missing - uploads are disabled and listings will use image URLs."
    );
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "utkarshstay",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1600, crop: "limit" }],
    },
});

// Removes an asset from Cloudinary. Safe to call with a missing/default id.
async function destroyImage(publicId) {
    if (!isConfigured || !publicId || publicId === "listingimage") return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.warn("Cloudinary cleanup failed:", err.message);
    }
}

module.exports = { cloudinary, storage, destroyImage, isConfigured };
