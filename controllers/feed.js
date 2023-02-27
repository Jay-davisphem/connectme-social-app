const Post = require("../models/post");
const { validationResult } = require("express-validator");

const commonTask = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.errors = [];
  }
  next(err);
};
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json({ message: "Posts fetched successsfully.", posts });
  } catch (err) {
    commonTask(err, next);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 422;
      throw error;
    }
    res.json({ message: "Posts fetched successsfully.", post });
  } catch (err) {
    commonTask(err, next);
  }
};
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }
    if(!req.file){
      const error = new Error('No image provided')
      error.statusCode = 422
      throw error
    }
    const imageUrl = req.file.path
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: { name: "davisphem" },
    });
    // create post in db
    await post.save();
    res.status(201).json({
      message: "Post successfully created",
      post,
    });
  } catch (err) {
    commonTask(err, next);
  }
};
