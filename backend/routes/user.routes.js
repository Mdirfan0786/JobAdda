import { Router } from "express";
import {
  Login,
  register,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import multer from "multer";

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

router.post(
  "/upload_profile_picture",
  upload.single("profile_picture"),
  uploadProfilePicture
);
router.post("/register", register);
router.post("/login", Login);

export default router;
