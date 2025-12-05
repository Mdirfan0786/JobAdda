import { Router } from "express";
import {
  acceptConnectionRequest,
  downloadResume,
  getAllUserProfile,
  getMyConnectionRequest,
  getUserAndProfile,
  Login,
  register,
  sendConnectionRequest,
  updateUserProfile,
  uploadProfilePicture,
  userUpdateProfile,
  WhatAreMyConnection,
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
router.get("/user/download_resume", downloadResume);
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/get_my_connection_request", getMyConnectionRequest);
router.get("/user/user_connection_request", WhatAreMyConnection);
router.get("/user/accept_connection_request", acceptConnectionRequest);

export default router;
