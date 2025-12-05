import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

//* =============== Register new User =============== *//
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "user already exist!" });

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

    res.json({ token, userId: user._id });
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

//* =============== Updating User Profile =============== *//
export const userUpdateProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(404).json({ message: "User not found!" });
      }
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
    const { token } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const UserProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    res.json(UserProfile);
  } catch (err) {
    console.error("Error While getting User Profile! ", err.message);
  }
};
