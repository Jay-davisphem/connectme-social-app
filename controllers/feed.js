const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { raiseError, catchError, clearImage } = require("../service/utils");
const io = require("../socket").getIO();

exports.getPosts = async (req, res, next) => {
  const PER_PAGE = 2;
  try {
    let curPage = req.query.page || 1;
    const perPage = +req.query.limit || PER_PAGE;
    if (curPage < 1) curPage = 1;
    const count = await Post.count();
    const totalPage = Math.ceil(count / perPage);
    if (totalPage && curPage > totalPage) curPage = totalPage;
    const posts = await Post.aggregate([
      { $skip: perPage * (curPage - 1) },
      { $limit: perPage },
      { $populate: "creator" },
      { $sort: "$createdAt" },
    ]);
    const url = req.get("host") + "/feed/posts/?page=";
    res.json({
      message: "Posts fetched successsfully.",
      posts,
      next: curPage >= totalPage ? null : `${url}${+curPage + 1}`,
      previous: curPage <= 1 ? null : `${url}${+curPage - 1}`,
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
      creator: req.userId,
    });
    // create post in db
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.emit("post", {
      action: "create",
      post: { ...post._doc, creator: { _id: user._id, name: user.name } },
    });
    res.status(201).json({
      message: "Post successfully created",
      post,
      creator: user,
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
    const post = await Post.findOne({
      _id: postId,
      creator: req.userId,
    }).populate("creator");
    if (!post) raiseError("Post not found", 404);
    if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);
    await post.updateOne({ title, imageUrl, content });
    io.emit("post", { action: "update", post });
    return res.status(200).json({ message: "Post updated", post });
  } catch (err) {
    catchError(err, next);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({
      _id: postId,
      creator: req.userId,
    });
    if (!post) raiseError("Could not find post.", 404);
    clearImage(post.imageUrl);
    await post.delete();
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    //const changedUserPosts = user.posts.filter((post) => post._id != postId);
    //user.posts = changedUserPosts;
    await user.save();
    io.emit("post", { action: "delete", post: postId });
    res.json({ message: "Post successfully deleted!" });
  } catch (err) {
    catchError(err, next);
  }
};
