const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { catchError, raiseError } = require("../service/utils");
exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) raiseError("Validation failed", 422, errors.array());
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashed });
    await user.save();
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    catchError(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) raiseError("User does not exist!", 401);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) raiseError("Wrong password", 401);
    const token = jwt.sign({ email, userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    catchError(err, next);
  }
};

exports.logout = (req, res, next) => {};
