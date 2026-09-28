const multer = require("multer");
const { storage } = require("../config/cloudinary.js");
const ExpressError = require("../utils/ExpressError.js");

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
        cb(new ExpressError(400, "Upload a JPG, PNG or WEBP image."));
    },
});

// Wraps multer so its own errors become normal API errors instead of
// crashing out with a raw MulterError.
module.exports = (field) => (req, res, next) => {
    upload.single(field)(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            const message =
                err.code === "LIMIT_FILE_SIZE"
                    ? "Image must be smaller than 5 MB."
                    : "That image could not be uploaded.";
            return next(new ExpressError(400, message));
        }
        next(err);
    });
};
