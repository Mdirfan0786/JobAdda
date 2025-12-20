import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

dotenv.config();

//* =============== Converting UserData to PDF =============== *//
const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  const imagePath = userData?.userId?.profilePicture
    ? `uploads/${userData.userId.profilePicture}`
    : "uploads/default.jpg";

  doc.image(imagePath, {
    align: "center",
    width: 100,
  });

  doc.moveDown(0.5);

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`CurrentPost: ${userData.currentPost}`);

  doc.moveDown(0.5);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Company: ${work.company}`);
    doc.fontSize(12).text(`Position: ${work.position}`);
    doc.fontSize(12).text(`Years: ${work.years}`);
  });
  doc.moveDown(0.5);

  doc.fontSize(14).text("Education: ");
  userData.education.forEach((education, index) => {
    doc.moveDown(0.5);
    doc.fontSize(12).text(`School: ${education.school}`);
    doc.fontSize(12).text(`Degree: ${education.degree}`);
    doc.fontSize(12).text(`fieldOfStudy: ${education.fieldOfStudy}`);
  });

  doc.end();

  return outputPath;
};

//* =============== Register new User =============== *//
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "email & Username already exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.json({ message: "User created!" });
  } catch (err) {
    console.log("Error while Register a new user : ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Login =============== *//
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Invalid Credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "1hr",
    // });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { $set: { token } });

    res.json({ token: token, userId: user._id });
  } catch (err) {
    console.error("Error while fetching User details! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Uploading Profile Picture =============== *//
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({ message: "profile picture updated!" });
  } catch (err) {
    console.error("Error while uploading profile picture! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Uploading Profile Background Picture =============== *//
export const uploadingBackgroundPicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.profileBackgroundPicture = req.file.filename;
    await user.save();

    return res.json({ message: "profile background picture updated!" });
  } catch (err) {
    console.error("Error while uploading profile picture! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Updating User Profile =============== *//
export const userUpdateProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({
        message: "Email or Username already taken!",
      });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User Updated!" });
  } catch (err) {
    console.error("Error while updating user profile! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== getting User and User Profile =============== *//
export const getUserAndProfile = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const UserProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture profileBackgroundPicture"
    );

    res.json(UserProfile);
  } catch (err) {
    console.error("Error While getting User Profile! ", err.message);
  }
};

//* =============== Update User Profile Data =============== *//
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserProfileData } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const updateUserProfile = await Profile.findOne({ userId: user._id });
    Object.assign(updateUserProfile, newUserProfileData);

    await updateUserProfile.save();

    return res.json({ message: "User Profile Updated!" });
  } catch (err) {
    console.error("Error while Updating User Profile! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Getting all User Profile =============== *//
export const getAllUserProfile = async (req, res) => {
  try {
    let profile = await Profile.find().populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture"
    );

    profile = profile.filter((p) => p.userId !== null);

    return res.json({ profile });
  } catch (err) {
    console.error("Error while getting All User Profile data! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Download Resume =============== *//
export const downloadResume = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email profilePicture"
  );

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

//* =============== Sending Connection Request =============== *//
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found!" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(404).json({ message: "Request already send!" });
    }

    const Request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await Request.save();

    return res.json({ message: "Request sent" });
  } catch (err) {
    console.log("Error while Sending Connection Request! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Getting My Connection Request =============== *//
export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const connections = await ConnectionRequest.findOne({
      userId: user._id,
    }).populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture"
    );

    return res.json({ connections });
  } catch (err) {
    console.log("Error While Getting My Connection Request! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== What Are My Connection Request =============== *//
export const WhatAreMyConnection = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const myConnections = await ConnectionRequest.findOne({
      connectionId: user._id,
    }).populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture"
    );

    return res.json(myConnections);
  } catch (err) {
    console.error(
      "Error While knowing What Are My Connection Request! ",
      err.message
    );
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Accept Connection Request =============== *//
export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found!" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "request Accepted!" });
  } catch (err) {
    console.error("Error While Accept Connection Request! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Get User Details Based On Username =============== *//
export const getUserDetailsBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    console.error("Error while fetching user profile:", err);
    return res.status(500).json({ message: "Server Error!" });
  }
};
