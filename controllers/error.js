module.exports = (error, req, res, next) => {
  const { statusCode, message, errors } = error;
  res.status(statusCode).json({ message, errors });
};
