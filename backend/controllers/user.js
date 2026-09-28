const passport = require("passport");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const { publicUser } = require("../utils/serialize.js");

// POST /api/auth/signup
module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const registered = await User.register(new User({ username, email }), password);
        req.login(registered, (err) => {
            if (err) return next(err);
            res.status(201).json({ success: true, data: publicUser(registered) });
        });
    } catch (err) {
        // passport-local-mongoose reports a taken username as UserExistsError.
        if (err.name === "UserExistsError") {
            return next(new ExpressError(409, err.message));
        }
        next(err);
    }
};

// POST /api/auth/login
module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return next(
                new ExpressError(401, (info && info.message) || "Incorrect username or password.")
            );
        }
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            res.json({ success: true, data: publicUser(user) });
        });
    })(req, res, next);
};

// POST /api/auth/logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie("utkarshstay.sid");
            res.json({ success: true, message: "Logged out." });
        });
    });
};

// GET /api/auth/me
module.exports.me = (req, res) => {
    res.json({ success: true, data: req.isAuthenticated() ? publicUser(req.user) : null });
};
