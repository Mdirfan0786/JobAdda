import { Router } from "express";
import {
  activeCheck,
  createPost,
  deletePost,
  getAllPosts,
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
router.post("/create_post", upload.single("media"), createPost);
router.get("/posts", getAllPosts);
router.delete("/delete_post", deletePost);

export default router;
