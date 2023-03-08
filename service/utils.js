const path = require("node:path");
const fs = require("node:fs");
exports.raiseError = (msg, statusCode = 422, errors = []) => {
  const error = new Error(msg);
  error.statusCode = statusCode;
  error.errors = errors;
  throw error;
};

exports.catchError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.errors = [];
  }
  next(err);
};

exports.clearImage = (filePath) => {
  try {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
};
