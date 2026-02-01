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
  upload.single("profile_picture"),
  uploadProfilePicture,
);

router.post(
  "/upload_profile_background_picture",
  upload.single("profile_background_picture"),
  uploadingBackgroundPicture,
);

router.patch("/user_update", userUpdateProfile);
router.post("/add_work_history", CreateWorkHistory);
router.put("/update_work_history/:workId", updateWorkHistory);
router.delete("/delete_User_Work_details/:workId", delete_User_Work_details);

router.post("/add_Education_details", CreateEducationDetails);
router.put("/update_Education_details/:educationId", updateEducationDetails);
router.delete(
  "/delete_User_Education_details/:educationId",
  delete_User_Education_details,
);
router.put("/update_user_profile", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.get(
  "/user/get_Profile_based_on_username/:username",
  getUserDetailsBasedOnUsername,
);

// ================= USERS =================
router.get("/user/get_all_users", getAllUserProfile);
router.get("/user/download_resume", downloadResume);

// ================= CONNECTION SYSTEM =================

// send request
router.post("/user/send_connection_request", sendConnectionRequest);

// sent (outgoing)
router.get("/user/sent_requests", getSentRequests);

// received (incoming)
router.get("/user/received_requests", getReceivedRequests);

// accepted connections
router.get("/user/connections", getConnections);

// accept / reject
router.post("/user/accept_connection_request", acceptConnectionRequest);

export default router;
