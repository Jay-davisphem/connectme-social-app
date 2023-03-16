const { raiseError, clearImage } = require("../service/utils");
module.exports = (req, res, next) => {
  if (!req.isAuth) raiseError("Not authenticated.", 422);
  if (!req) return res.status(200).json({ message: "No file provided!" });
  if (req.body.oldPath) clearImage(req.body.oldPath);
  return res
    .status(201)
    .json({ message: "File stored", filePath: req.file.path });
};
