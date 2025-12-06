import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import bcrypt from "bcrypt";

//* =============== Checking Server is running or not! =============== *//
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

//* =============== Creating Posts =============== *//
export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      likes: req.body.likes,
      media: req.file !== undefined ? req.file.filename : "",
      fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();

    return res.status(200).json({ message: "Post Created!" });
  } catch (err) {
    console.error("Error While Creating Post");
    return res.json({ message: "Server Error!" });
  }
};

//* =============== Getting All Posts =============== *//
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ posts });
  } catch (err) {
    console.error("Error While Getting All Posts! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Delete Posts =============== *//
export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found!" });

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Unauthorize!" });
    }

    await post.deletePost({ _id: post_id });
    return res.json({ message: "Post Deleted!" });
  } catch (err) {
    console.error("Error While Deleting Post! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};
