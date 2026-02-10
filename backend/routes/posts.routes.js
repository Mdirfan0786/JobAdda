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
import multer from "multer";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ================= PUBLIC =================
router.get("/", activeCheck);
router.get("/posts", getAllPosts);
router.get("/get_comments", get_comment_by_post);

// ================= PROTECTED =================
router.post("/create_post", isLoggedIn, upload.single("media"), createPost);

router.post("/comment", isLoggedIn, commentPost);

router.post("/increment_post_likes", isLoggedIn, increament_Likes);

router.delete("/delete_post", isLoggedIn, deletePost);

router.delete("/delete_comment", isLoggedIn, deleteCommentOfUser);

export default router;
