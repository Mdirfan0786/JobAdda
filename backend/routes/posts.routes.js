import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteCommentOfUser,
  deletePost,
  get_comment_by_post,
  getAllPosts,
  increament_Likes,
} from "../controllers/posts.controller.js";
import multer, { diskStorage } from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", activeCheck);

// Post routes
router.post("/create_post", upload.single("media"), createPost);
router.get("/posts", getAllPosts);
router.delete("/delete_post", deletePost);

// Comment Routes
router.post("/comment", commentPost);
router.get("/get_comments", get_comment_by_post);
router.delete("/delete_comment", deleteCommentOfUser);
router.post("/increment_post_likes", increament_Likes);

export default router;
