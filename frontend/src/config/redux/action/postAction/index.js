import { clientServer } from "@/config";
import { asyncThunkCreator, createAsyncThunk } from "@reduxjs/toolkit";

// ============== Get All Posts ============== //
export const getAllPosts = createAsyncThunk(
  "/post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ============== Creating Posts ============== //
export const CreatePost = createAsyncThunk(
  "post/create_post",
  async ({ file, body }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("body", body);

      if (file) {
        formData.append("media", file);
      }

      const response = await clientServer.post("/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ============== Delete Post ============== //
export const deletePost = createAsyncThunk(
  "post/delete",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });

      return response.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Something Went Wrong!");
    }
  }
);

// ============== Increment Posts Likes ============== //
export const incrementPostLikes = createAsyncThunk(
  "post/incrementLikes",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_likes", {
        post_id: postId,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
