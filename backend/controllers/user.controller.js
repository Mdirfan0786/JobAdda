import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

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
export const register = async (req, res, next) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      throw new AppError(400, "All fields are required!");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new AppError(400, "Email or Username already exists!");
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
    next(err);
  }
};

//* =============== Login =============== *//
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "All fields are required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(400, "invalid Credential!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError(400, "invalid Credential!");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      token,
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

//* =============== Uploading Profile Picture =============== *//
export const uploadProfilePicture = async (req, res, next) => {
  try {
    const user = req.user;

    user.profilePicture = req.file.filename;
    await user.save();

    res.json({ message: "profile picture updated!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Uploading Profile Background Picture =============== *//
export const uploadingBackgroundPicture = async (req, res, next) => {
  try {
    const user = req.user;

    user.profileBackgroundPicture = req.file.filename;
    await user.save();

    return res.json({ message: "profile background picture updated!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Updating User Profile =============== *//
export const userUpdateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const newUserData = req.body;

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      throw new AppError(400, "Email or Username already taken!");
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User Updated!" });
  } catch (err) {
    next(err);
  }
};

//* =============== getting User and User Profile =============== *//
export const getUserAndProfile = async (req, res, next) => {
  try {
    const user = req.user;

    const UserProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture profileBackgroundPicture",
    );

    if (!UserProfile) {
      throw new AppError(404, "Profile not found");
    }

    res.json(UserProfile);
  } catch (err) {
    next(err);
  }
};

//* =============== Update User Profile Data =============== *//
export const updateUserProfile = async (req, res, next) => {
  try {
    const { bio, currentPost } = req.body;
    const user = req.user;

    const profile = await Profile.findOne({ userId: user._id });

    if (bio !== undefined) profile.bio = bio;
    if (currentPost !== undefined) profile.currentPost = currentPost;

    await profile.save();

    return res.json({ message: "Profile updated safely!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Create Work history =============== *//
export const CreateWorkHistory = async (req, res, next) => {
  try {
    const { company, position, years } = req.body;
    const user = req.user;

    if (!company || !position || !years) {
      throw new AppError(400, "Company, position and years are required");
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw new AppError(404, "Profile Not Found!");
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
    next(err);
  }
};

//* =============== Update Work history =============== *//
export const updateWorkHistory = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const { company, position, years } = req.body;
    const user = req.user;

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    const work = profile.pastWork.id(workId);

    if (!work) {
      throw new AppError(404, "Work history not found");
    }

    work.company = company;
    work.position = position;
    work.years = years;

    await profile.save();

    return res.json({ message: "Work history updated successfully!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Delete Work Details =============== *//
export const delete_User_Work_details = async (req, res, next) => {
  try {
    const user = req.user;
    const { workId } = req.params;

    if (!workId) {
      throw new AppError(400, "workId are required!");
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw new AppError(404, "profile not found!");
    }
    const work = profile.pastWork.id(workId);

    if (!work) {
      throw new AppError(404, "work details not found!");
    }

    work.deleteOne();
    await profile.save();

    return res.status(200).json({
      message: "User Work Details Delete Successfully!",
      pastwork: profile.pastWork,
    });
  } catch (err) {
    next(err);
  }
};

//* =============== Create Education Details =============== *//
export const CreateEducationDetails = async (req, res, next) => {
  try {
    const { school, degree, fieldOfStudy } = req.body;
    const user = req.user;

    if (!school || !degree || !fieldOfStudy) {
      throw new AppError(400, "School, Degree and FieldOfStudy are required");
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw new AppError(404, "profile not found!");
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
    next(err);
  }
};

//* =============== Update Education Details =============== *//
export const updateEducationDetails = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const { school, degree, fieldOfStudy } = req.body;

    const user = req.user;

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw new AppError(404, "profile not found!");
    }

    const education = profile.education.id(educationId);

    if (!education) {
      throw new AppError(404, "Education Details not found");
    }

    education.school = school;
    education.degree = degree;
    education.fieldOfStudy = fieldOfStudy;

    await profile.save();

    return res.json({ message: "Education details updated successfully!" });
  } catch (err) {
    next(err);
  }
};

//* =============== Delete Education Details =============== *//
export const delete_User_Education_details = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const user = req.user;

    if (!educationId) {
      throw new AppError(400, "educationId are required");
    }

    const profile = await Profile.findOne({ userId: user._id });
    const education = profile.education.id(educationId);

    if (!education) {
      throw new AppError(404, "Education Details not found");
    }

    education.deleteOne();
    await profile.save();

    return res.status(200).json({
      message: "Education Details Delete Successfully!",
      education: profile.education,
    });
  } catch (err) {
    next(err);
  }
};

//* =============== Getting all User Profile =============== *//
export const getAllUserProfile = async (req, res, next) => {
  try {
    let profile = await Profile.find().populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture",
    );

    profile = profile.filter((p) => p.userId !== null);

    return res.json({ profile });
  } catch (err) {
    next(err);
  }
};

//* =============== Download Resume =============== *//
export const downloadResume = async (req, res, next) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture",
    );

    if (!userProfile) {
      throw new AppError(404, "Profile not found");
    }

    let outputPath = await convertUserDataTOPDF(userProfile);

    return res.json({ message: outputPath });
  } catch (err) {
    next(err);
  }
};

//* =============== Sending Connection Request =============== *//
export const sendConnectionRequest = async (req, res, next) => {
  try {
    const user = req.user;
    const { connectionId } = req.body;

    if (String(user._id) === String(connectionId)) {
      throw new AppError(400, "Cannot connect with yourself");
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
    next(err);
  }
};

//* =============== Getting send Request =============== *//
export const getSentRequests = async (req, res, next) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
      userId: user._id,
      status: "pending",
    }).populate("connectionId", "name username profilePicture");

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

//* =============== get received Request =============== *//
export const getReceivedRequests = async (req, res, next) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
      connectionId: user._id,
      status: "pending",
    }).populate("userId", "name username profilePicture");

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

//* =============== get Connection Request =============== *//

export const getConnections = async (req, res, next) => {
  try {
    const user = req.user;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ userId: user._id }, { connectionId: user._id }],
    }).populate("userId connectionId", "name username profilePicture");

    res.json(connections);
  } catch (err) {
    next(err);
  }
};

//* =============== Accept Connection Request =============== *//
export const acceptConnectionRequest = async (req, res, next) => {
  try {
    const { requestId, action } = req.body;
    const user = req.user;

    const connection = await ConnectionRequest.findById(requestId);
    if (!connection) {
      throw new AppError(404, "Request not found");
    }

    connection.status = action === "accept" ? "accepted" : "rejected";
    await connection.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};

//* =============== Get User Details Based On Username =============== *//
export const getUserDetailsBasedOnUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      throw new AppError(404, "User not found!");
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture profileBackgroundPicture",
    );

    if (!userProfile) {
      throw new AppError(404, "Profile not found!");
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    next(err);
  }
};
