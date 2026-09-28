const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// passport-local-mongoose v9 ships as an ES module with a default export,
// so the plugin lives on `.default` when required from CommonJS.
const passportLocalMongoose =
    require("passport-local-mongoose").default ||
    require("passport-local-mongoose");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// Adds `username`, `hash`, `salt`, and the register/authenticate helpers.
userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: "That username is already taken.",
        IncorrectPasswordError: "Incorrect username or password.",
        IncorrectUsernameError: "Incorrect username or password.",
    },
});

module.exports = mongoose.model("User", userSchema);
