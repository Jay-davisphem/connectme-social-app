const Post = require("../models/post");
const { validationResult } = require("express-validator");

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.json(posts);
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }
  const { title, content } = req.body;
  try {
    const post = new Post({
      title,
      content,
      creator: { name: "davisphem" },
      imageUrl: "davisphem.me",
    });
    // create post in db
    await post.save();
    res.status(201).json({
      message: "Post successfully created",
      post: post,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
