exports.getPosts = (req, res, next) => {
  res.json({
    posts: [
      { title: "First Post", content: "This is the first post" },
      { title: "Second Post", content: "This is the second post" },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  // create post in db

  res.status(201).json({
    message: "Post successfully created",
    post: { title, content, id: new Date().toISOString() },
  });
};
