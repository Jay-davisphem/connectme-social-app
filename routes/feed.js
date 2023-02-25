const express = require("express");
const { body } = require("express-validator");
const feedControllers = require("../controllers/feed");

const router = express.Router();

router.get("/posts", feedControllers.getPosts);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.createPost
);
module.exports = router;