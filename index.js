const path = require("node:path");

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const { graphqlHTTP } = require("express-graphql");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const errorController = require("./controllers/error");
const setHeaders = require("./middlewares/setHeaders");
const auth = require("./middlewares/auth");
const imageControllers = require("./graphql/image.controllers");
const { fileStorage, fileFilter } = require("./service/image.service");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const app = express();
const PORT = 3000;

app.use(morgan("dev"));

require("dotenv").config();

app.use(express.json()); // parse incoming json data
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(auth);
app.use(setHeaders);

// handle saving image put request
app.put("/attach-image-url", imageControllers);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);
app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use("/admin", adminRoutes);
app.use(errorController);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log("Connected TO http://localhost:" + PORT);
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected!");
    });
  })
  .catch(console.error);
