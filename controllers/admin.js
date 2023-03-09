const User = require("../models/user");
const { catchError } = require("../service/utils");
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().all();
    res.json({ message: "Success", users });
  } catch (err) {
    catchError(err, next);
  }
};
