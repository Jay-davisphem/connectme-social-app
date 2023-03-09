const express = require("express");
const { body } = require("express-validator");
const feedControllers = require("../controllers/feed");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.get("/posts", isAuth, feedControllers.getPosts);
router.get("/post/:postId", isAuth, feedControllers.getPost);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.createPost
);
router.put(
  "/post/:postId",
  isAuth,
  [
    //body("title").trim().isLength({ min: 5 }),
    //body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.updatePost
);

router.delete("/post/:postId", isAuth, feedControllers.deletePost);
module.exports = router;
