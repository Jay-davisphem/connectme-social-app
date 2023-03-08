module.exports = (error, req, res, next) => {
  const { statusCode, message, errors } = error;
  res.status(statusCode || 500).json({ message, errors });
};
