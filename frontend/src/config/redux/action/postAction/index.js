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

// ============== Get All Comments ============== //
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// ============== Post Comment ============== //
export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      console.log({
        post_id: commentData.post_id,
        body: commentData.body,
      });

      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Something Went Wrong!");
    }
  }
);

// ============== Delete Comment ============== //
export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async ({ comment_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_comment", {
        data: {
          token: localStorage.getItem("token"),
          comment_id,
        },
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Something Went Wrong!");
    }
  }
);
