const jwt = require("jsonwebtoken");
const { raiseError, catchError } = require("../service/utils");
module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")?.trim()?.split(" ");
    if (
      !authHeader ||
      authHeader.length !== 2 ||
      authHeader[0].toLowerCase() !== "bearer"
    )
      raiseError("JWT contructed wrongly.", 403);
    const token = authHeader[1];
    const decToken = jwt.verify(token, process.env.SECRET);
    if (!decToken) raiseError("Not authenticated.", 401);
    req.userId = decToken.userId;
    next();
  } catch (err) {
    catchError(err, next);
  }
};
