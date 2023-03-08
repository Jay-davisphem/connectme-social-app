const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("node:crypto");
const feedRoutes = require("./routes/feed");
const errorController = require("./controllers/error");
const setHeaders = require("./middlewares/setHeaders");
const app = express();
const PORT = 3000;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + "-" + file.originalname);
  },
});
const fileFilter = (res, file, cb) => {
  const mimetypes = new Set(["image/png", "image/jpg", "image/jpeg"]);
  if (mimetypes.has(file.mimetype)) cb(null, true);
  else cb(null, false);
};
app.use(morgan("dev"));

require("dotenv").config();

app.use(express.json()); // parse incoming json data
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(setHeaders);

app.use("/feed", feedRoutes);

app.use(errorController);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Connected TO http://localhost:" + PORT);
    });
  })
  .catch(console.error);
