const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const setHeaders = require("./middlewares/setHeaders");
const app = express();
const PORT = 3000;
app.use(morgan("dev"));

require('dotenv').config()

app.use(express.json()); // parse incoming json data
app.use(setHeaders);

app.use("/feed", feedRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(PORT, () => console.log("Connected TO http://localhost:" + PORT));
  })
  .catch(console.error);
