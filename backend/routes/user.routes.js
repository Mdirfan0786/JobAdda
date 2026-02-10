import { Router } from "express";
import multer from "multer";
import {
  register,
  Login,
  uploadProfilePicture,
  uploadingBackgroundPicture,
  userUpdateProfile,
  getUserAndProfile,
  updateUserProfile,
  getAllUserProfile,
  downloadResume,
  sendConnectionRequest,
  getSentRequests,
  getReceivedRequests,
  getConnections,
  acceptConnectionRequest,
  getUserDetailsBasedOnUsername,
  CreateWorkHistory,
  updateWorkHistory,
  CreateEducationDetails,
  updateEducationDetails,
  delete_User_Education_details,
  delete_User_Work_details,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// ================= AUTH =================
router.post("/register", register);
router.post("/login", Login);

// ================= PROFILE =================
router.post(
  "/upload_profile_picture",
  isLoggedIn,
  upload.single("profile_picture"),
  uploadProfilePicture,
);

router.post(
  "/upload_profile_background_picture",
  isLoggedIn,
  upload.single("profile_background_picture"),
  uploadingBackgroundPicture,
);

router.patch("/user_update", isLoggedIn, userUpdateProfile);
router.post("/add_work_history", isLoggedIn, CreateWorkHistory);
router.put("/update_work_history/:workId", isLoggedIn, updateWorkHistory);
router.delete(
  "/delete_User_Work_details/:workId",
  isLoggedIn,
  delete_User_Work_details,
);

router.post("/add_Education_details", isLoggedIn, CreateEducationDetails);
router.put(
  "/update_Education_details/:educationId",
  isLoggedIn,
  updateEducationDetails,
);
router.delete(
  "/delete_User_Education_details/:educationId",
  isLoggedIn,
  delete_User_Education_details,
);
router.put("/update_user_profile", isLoggedIn, updateUserProfile);
router.get("/get_user_and_profile", isLoggedIn, getUserAndProfile);
router.get(
  "/user/get_Profile_based_on_username/:username",
  getUserDetailsBasedOnUsername,
);

// ================= USERS =================
router.get("/user/get_all_users", isLoggedIn, getAllUserProfile);
router.get("/user/download_resume", isLoggedIn, downloadResume);

// ================= CONNECTION SYSTEM =================

// send request
router.post("/user/send_connection_request", isLoggedIn, sendConnectionRequest);

// sent (outgoing)
router.get("/user/sent_requests", isLoggedIn, getSentRequests);

// received (incoming)
router.get("/user/received_requests", isLoggedIn, getReceivedRequests);

// accepted connections
router.get("/user/connections", isLoggedIn, getConnections);

// accept / reject
router.post(
  "/user/accept_connection_request",
  isLoggedIn,
  acceptConnectionRequest,
);

export default router;
