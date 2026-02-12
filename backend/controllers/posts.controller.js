import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import AppError from "../utils/appError.js";

//* =============== Checking Server is running or not! =============== *//
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

//* =============== Creating Posts =============== *//
export const createPost = async (req, res, next) => {
  try {
    const user = req.user;

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      likes: 0,
      media: req.file ? req.file.filename : "",
      fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    res.status(201).json({ message: "Post Created!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Getting All Posts =============== *//
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ posts });
  } catch (err) {
    next(err);
  }
};

//* =============== Delete Posts =============== *//
export const deletePost = async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const user = req.user;

    const post = await Post.findById(post_id);
    if (!post) {
      throw new AppError(404, "Post not found!");
    }

    if (post.userId.toString() !== user._id.toString()) {
      throw new AppError(403, "Unauthorized!");
    }

    await Post.deleteOne({ _id: post_id });
    await Comment.deleteMany({ postId: post_id });

    res.json({ message: "Post Deleted!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Comment Posts =============== *//
export const commentPost = async (req, res, next) => {
  try {
    const { post_id, commentBody } = req.body;
    const user = req.user;

    const post = await Post.findById(post_id);
    if (!post) {
      throw new AppError(404, "Post not found!");
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();

    res.status(201).json({ message: "Comment Added!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Get Comment Posts =============== *//
export const get_comment_by_post = async (req, res, next) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) throw new AppError(404, "Post not found!");

    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ comments });
  } catch (err) {
    next(err);
  }
};

//* =============== Delete Comment Posts =============== *//
export const deleteCommentOfUser = async (req, res, next) => {
  try {
    const { comment_id } = req.body;
    const user = req.user;

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      throw new AppError(404, "Comment not found!");
    }

    if (comment.userId.toString() !== user._id.toString()) {
      throw new AppError(403, "Unauthorized!");
    }

    await Comment.deleteOne({ _id: comment_id });

    res.json({ message: "Comment Deleted!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Increament Likes =============== *//
export const increament_Likes = async (req, res, next) => {
  try {
    const { post_id } = req.body;

    const post = await Post.findById(post_id);
    if (!post) {
      throw new AppError(404, "Post not found!");
    }

    post.likes += 1;
    await post.save();

    res.json({ message: "Likes increased!" });
  } catch (err) {
    next(err);
  }
};
