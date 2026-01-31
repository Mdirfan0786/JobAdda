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
      "name email username profilePicture profileBackgroundPicture",
    );

    res.json(UserProfile);
  } catch (err) {
    console.error("Error While getting User Profile! ", err.message);
  }
};

//* =============== Update User Profile Data =============== *//
export const updateUserProfile = async (req, res) => {
  try {
    const { token, bio, currentPost } = req.body;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const profile = await Profile.findOne({ userId: user._id });

    if (bio !== undefined) profile.bio = bio;
    if (currentPost !== undefined) profile.currentPost = currentPost;

    await profile.save();

    return res.json({ message: "Profile updated safely!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Create Work history =============== *//
export const CreateWorkHistory = async (req, res) => {
  try {
    const { token, company, position, years } = req.body;

    if (!company || !position || !years) {
      return res.status(400).json({
        message: "Company, position and years are required",
      });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile Not Found!" });
    }

    profile.pastWork.push({
      company: company.trim(),
      position: position.trim(),
      years: years.trim(),
    });

    await profile.save();

    return res.status(200).json({
      message: "Work history added successfully!",
      pastWork: profile.pastWork,
    });
  } catch (err) {
    console.error("Error While Adding Work!", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Update Work history =============== *//
export const updateWorkHistory = async (req, res) => {
  const { workId } = req.params;
  const { token, company, position, years } = req.body;

  const user = await User.findOne({ token });
  if (!user) return res.status(404).json({ message: "User not found" });

  const profile = await Profile.findOne({ userId: user._id });
  const work = profile.pastWork.id(workId);

  if (!work) {
    return res.status(404).json({ message: "Work history not found" });
  }

  work.company = company;
  work.position = position;
  work.years = years;

  await profile.save();

  return res.json({ message: "Work history updated successfully!" });
};

//* =============== Create Education Details =============== *//
export const CreateEducationDetails = async (req, res) => {
  try {
    const { token, school, degree, fieldOfStudy } = req.body;

    if (!school || !degree || !fieldOfStudy) {
      return res.status(400).json({
        message: "School, Degree and FieldOfStudy are required",
      });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile Not Found!" });
    }

    profile.education.push({
      school: school.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
    });

    await profile.save();

    return res.status(200).json({
      message: "Education Details successfully!",
      education: profile.education,
    });
  } catch (err) {
    console.error("Error While Adding Education Details!", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== Update Education Details =============== *//
export const updateEducationDetails = async (req, res) => {
  const { educationId } = req.params;
  const { token, school, degree, fieldOfStudy } = req.body;

  const user = await User.findOne({ token });
  if (!user) return res.status(404).json({ message: "User not found" });

  const profile = await Profile.findOne({ userId: user._id });
  const education = profile.education.id(educationId);

  if (!education) {
    return res.status(404).json({ message: "Education Details not found" });
  }

  education.school = school;
  education.degree = degree;
  education.fieldOfStudy = fieldOfStudy;

  await profile.save();

  return res.json({ message: "Education details updated successfully!" });
};

//* =============== Getting all User Profile =============== *//
export const getAllUserProfile = async (req, res) => {
  try {
    let profile = await Profile.find().populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture",
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
    "name username email profilePicture",
  );

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

//* =============== Sending Connection Request =============== *//
export const sendConnectionRequest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || authHeader;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const { connectionId } = req.body;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (String(user._id) === String(connectionId)) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { userId: user._id, connectionId },
        { userId: connectionId, connectionId: user._id },
      ],
    });

    if (existingRequest) {
      return res.json({ alreadySent: true, request: existingRequest });
    }

    const request = await ConnectionRequest.create({
      userId: user._id,
      connectionId,
      status: "pending",
    });

    return res.status(201).json({ alreadySent: false, request });
  } catch (err) {
    console.error("Send Connection Error:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

//* =============== Getting send Request =============== *//
export const getSentRequests = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await ConnectionRequest.find({
      userId: user._id,
      status: "pending",
    }).populate("connectionId", "name username profilePicture");

    res.json(requests);
  } catch (err) {
    console.error("Get Sent Requests Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//* =============== get received Request =============== *//
export const getReceivedRequests = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || authHeader;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await ConnectionRequest.find({
      connectionId: user._id,
      status: "pending",
    }).populate("userId", "name username profilePicture");

    res.json(requests);
  } catch (err) {
    console.error("Get Received Requests Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//* =============== get Connection Request =============== *//

export const getConnections = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || authHeader;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ userId: user._id }, { connectionId: user._id }],
    }).populate("userId connectionId", "name username profilePicture");

    res.json(connections);
  } catch (err) {
    console.error("Get Connections Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//* =============== Accept Connection Request =============== *//
export const acceptConnectionRequest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || authHeader;

    const { requestId, action } = req.body;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connection = await ConnectionRequest.findById(requestId);
    if (!connection)
      return res.status(404).json({ message: "Request not found" });

    connection.status = action === "accept" ? "accepted" : "rejected";
    await connection.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Accept Request Error:", err.message);
    res.status(500).json({ message: "Server Error" });
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
      "name username email profilePicture profileBackgroundPicture",
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
