const express = require("express");
const morgan = require("morgan");

const feedRoutes = require("./routes/feed");
const setHeaders = require('./middlewares/setHeaders')
const app = express();

app.use(morgan("dev"));

app.use(express.json()); // parse incoming json data
app.use(setHeaders)

app.use("/feed", feedRoutes);

app.listen(3000, () => console.log("Connected"));
