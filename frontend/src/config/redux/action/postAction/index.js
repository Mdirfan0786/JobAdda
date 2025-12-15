import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
