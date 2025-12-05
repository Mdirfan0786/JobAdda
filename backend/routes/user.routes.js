import { Router } from "express";
import {
  downloadResume,
  getAllUserProfile,
  getUserAndProfile,
  Login,
  register,
  updateUserProfile,
  uploadProfilePicture,
  userUpdateProfile,
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
router.patch("/user_update", userUpdateProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.put("/update_user_profile", updateUserProfile);
router.get("/user/get_all_user", getAllUserProfile);
router.get("/download_resume", downloadResume);

export default router;
