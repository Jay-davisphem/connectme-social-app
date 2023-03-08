const express = require("express");
const { body } = require("express-validator");
const feedControllers = require("../controllers/feed");

const router = express.Router();

router.get("/posts", feedControllers.getPosts);
router.get("/post/:postId", feedControllers.getPost);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.createPost
);
router.put(
  "/post/:postId",
  [
    //body("title").trim().isLength({ min: 5 }),
    //body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.updatePost
);

router.delete("/post/:postId", feedControllers.deletePost);
module.exports = router;
