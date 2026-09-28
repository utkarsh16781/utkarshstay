require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const connectDB = require("./config/db.js");
const User = require("./models/user.js");
const apiRoutes = require("./routes/index.js");
const { notFound, errorHandler } = require("./middleware/error.js");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Behind a proxy (Render, Railway, Heroku) secure cookies need this.
if (isProduction) app.set("trust proxy", 1);

/* ---------------------------------- CORS ---------------------------------- */
// The React app runs on its own origin and sends the session cookie, so the
// origin must be allow-listed explicitly - "*" is not valid with credentials.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

app.use(
    cors({
        origin(origin, cb) {
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
            cb(new Error("Origin not allowed by CORS"));
        },
        credentials: true,
    })
);

/* --------------------------------- Parsers -------------------------------- */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* --------------------------------- Session -------------------------------- */
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set. Copy .env.example to .env first.");
}

app.use(
    session({
        name: "utkarshstay.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false, // don't create sessions for anonymous visitors
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            touchAfter: 24 * 3600,
        }),
        cookie: {
            httpOnly: true,
            // maxAge is relative, so it is recalculated per response
            // (the old `expires: Date.now() + ...` froze at server start).
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        },
    })
);

/* -------------------------------- Passport -------------------------------- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* --------------------------------- Routes --------------------------------- */
app.use("/api", apiRoutes);

// Serve the built React app when the frontend has been built (npm run build).
const clientDist = path.join(__dirname, "..", "frontend", "dist");
if (isProduction) {
    app.use(express.static(clientDist));
    app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

/* --------------------------------- Startup -------------------------------- */
const PORT = process.env.PORT || 8080;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("Failed to start:", err.message);
        process.exit(1);
    });

module.exports = app;
