const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { raiseError, catchError, clearImage } = require("../service/utils");

exports.getPosts = async (req, res, next) => {
  const PER_PAGE = 2;
  try {
    let curPage = req.query.page || 1;
    const perPage = +req.query.limit || PER_PAGE;
    if (curPage < 1) curPage = 1;
    const count = await Post.count();
    const totalPage = Math.ceil(count / perPage);
    if (curPage > totalPage) curPage = totalPage;
    const posts = await Post.aggregate([
      { $skip: perPage * (curPage - 1) },
      { $limit: perPage },
    ]);
    const url = req.get("host") + "/feed/posts/?page=";
    res.json({
      message: "Posts fetched successsfully.",
      posts,
      next: curPage == totalPage ? null : `${url}${+curPage + 1}`,
      previous: curPage == 1 ? null : `${url}${+curPage - 1}`,
    });
  } catch (err) {
    catchError(err, next);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) raiseError("Post not found.");
    res.json({ message: "Posts fetched successsfully.", post });
  } catch (err) {
    catchError(err, next);
  }
};
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) raiseError("Validation Error", 422, errors.array());
    if (!req.file) raiseError("No image provided");
    const imageUrl = req.file.path;
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
    catchError(err, next);
  }
};

exports.updatePost = async (req, res, next) => {
  const { title, content, image } = req.body;
  const postId = req.params.postId;
  let imageUrl = image;
  try {
    if (req.file) imageUrl = req.file.path;
    const errors = validationResult(req);
    if (!errors.isEmpty()) raiseError("Validation Error", 422, errors.array());
    //if (!imageUrl) raiseError("Image not found");
    const post = await Post.findById(postId);
    if (!post) raiseError("Post not found", 404);
    if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);
    await post.updateOne({ title, imageUrl, content });
    return res.status(200).json({ message: "Post updated", post });
  } catch (err) {
    catchError(err, next);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) raiseError("Could not find post.", 404);
    clearImage(post.imageUrl);
    await post.delete();
    res.json({ message: "Post successfully deleted!" });
  } catch (err) {
    catchError(err, next);
  }
};
