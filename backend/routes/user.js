const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const validate = require("../middleware/validate.js");
const { signupSchema, loginSchema } = require("../schemas/index.js");
const users = require("../controllers/user.js");

router.post("/signup", validate(signupSchema), wrapAsync(users.signup));
router.post("/login", validate(loginSchema), users.login);
router.post("/logout", users.logout);
router.get("/me", users.me);

module.exports = router;
