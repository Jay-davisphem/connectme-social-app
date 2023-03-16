const jwt = require("jsonwebtoken");
const { catchError } = require("../service/utils");
module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")?.trim()?.split(" ");
    if (
      !authHeader ||
      authHeader.length !== 2 ||
      authHeader[0].toLowerCase() !== "bearer"
    ) {
      req.isAuth = false;
      return next();
    }
    const token = authHeader[1];
    const decToken = jwt.verify(token, process.env.SECRET);
    if (!decToken) {
      req.isAuth = false;
      return next();
    }
    req.userId = decToken.userId;
    req.isAuth = true;
    next();
  } catch (err) {
    catchError(err, next);
  }
};
