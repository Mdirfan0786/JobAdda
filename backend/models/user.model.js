import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "default.jpg",
    },

    profileBackgroundPicture: {
      type: String,
      default: "defaultBackground.jpg",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

export default User;
