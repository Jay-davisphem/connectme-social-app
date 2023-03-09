const router = require("express").Router();
const { body } = require("express-validator");
const authControllers = require("../controllers/auth");
const User = require("../models/user");
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) return Promise.reject("Email address already exists");
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authControllers.signup
);
router.post("/login", authControllers.login);
module.exports = router;
