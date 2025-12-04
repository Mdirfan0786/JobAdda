import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

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
    await User.updateOne({ id: user._id }, { token });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error while fetching User details! ", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};
