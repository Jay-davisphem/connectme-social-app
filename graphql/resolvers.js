const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const { raiseError } = require("../service/utils");
module.exports = {
  createUser: async ({ userInput }, req) => {
    const { email, name, password, role } = userInput;
    let user = await User.findOne({ email });
    if (user) raiseError("User exists already!");
    const hashed = await bcrypt.hash(password, 12);
    user = new User({
      email,
      name,
      role,
      password: hashed,
    });
    user = await user.save();
    return user.toJSON();
  },
  login: async ({ userInput }, req) => {
    const { email, password } = userInput;
    let user = await User.findOne({ email });
    if (!user) raiseError("User does not exist!", 401);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) raiseError("Password is incorrect!", 401);
    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.SECRET
    );
    return { userId: user._id, token };
  },
  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const { title, content, imageUrl } = postInput;

    if (
      !(
        title?.trim()?.length > 4 &&
        content?.trim()?.length > 4 &&
        imageUrl?.trim()
      )
    )
      raiseError("Invalid Input", 422);
    const creator = await User.findById(req.userId);
    if (!creator) raiseError("Invalid user", 401);
    const post = new Post({ title, content, imageUrl, creator });
    await post.save();
    if (!post) raiseError("Post not created", 401);
    creator.posts.push(post);
    creator.save();
    return post.toJSON();
  },
  getPosts: async ({ page, limit }, req) => {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 2;
    if (!req.isAuth) raiseError("Not authenticatd", 401);
    const totalPosts = await Post.find().all().count();
    const totalPage = Math.ceil(totalPosts / limit);
    if (page > totalPage) page = totalPage;
    const posts = await Post.find()
      .skip((+page - 1) * limit)
      .limit(+limit)
      .sort({ createdat: -1 })
      .populate("creator");
    return {
      posts,
      totalPosts,
      next: page >= totalPage ? null : +page + 1,
      previous: page <= 1 ? null : +page - 1,
    };
  },
  getPost: async ({ postId }, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const post = await Post.findById(postId);
    if (!post) raiseError("Post does not exists", 402);
    return post.toJSON();
  },
  updatePost: async ({ postId, postInput }, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const filter = { _id: postId, creator: req.userId };
    const post = await Post.findOneAndUpdate(filter, postInput, {
      new: true,
    }).populate("creator");
    const chkPost = await Post.exists({ _id: postId });
    if (!post && !chkPost) raiseError("Unauthorized", 403);
    if (!post) raiseError("Post does not exists", 402);

    return post.toJSON();
  },
  deletePost: async ({ postId }, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const filter = { _id: postId, creator: req.userId };
    const chkPost = await Post.exists({ _id: postId });
    const post = await Post.findOneAndDelete(filter);
    console.log(post, "...checking...", chkPost);
    if (!post && chkPost) raiseError("Unauthorized", 403);
    if (!post) raiseError("Post does not exists", 402);
    return true;
  },
  getUsers: async (args, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const user = await User.findById(req.userId);
    if (user.role !== "admin") raiseError("Unauthorized", 403);
    return await User.find().all();
  },
  updateUser: async ({ userInput }, req) => {
    if (!req.isAuth) raiseError("Not authenticated", 401);
    const adUser = await User.findById(req.userId);
    if (adUser.role !== "admin" || adUser.email !== userInput.email)
      raiseError("Unauthorized", 403);
    return await User.findOneAndUpdate({ _id: userInput.email }, userInput, {
      new: true,
    });
  },
};
