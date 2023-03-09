const { raiseError, catchError } = require("../service/utils");
const User = require("../models/user");
module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user.role !== "admin") raiseError("Not an admin", 403);
    next();
  } catch (err) {
    catchError(err, next);
  }
};
