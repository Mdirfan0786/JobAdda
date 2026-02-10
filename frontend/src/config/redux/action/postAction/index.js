import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ================= GET ALL POSTS =================
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/posts");
      return res.data.posts;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts",
      );
    }
  },
);

// ================= CREATE POST =================
export const CreatePost = createAsyncThunk(
  "post/createPost",
  async ({ file, body }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("body", body);

      if (file) {
        formData.append("media", file);
      }

      const res = await clientServer.post("/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create post",
      );
    }
  },
);

// ================= DELETE POST =================
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ post_id }, thunkAPI) => {
    try {
      const res = await clientServer.delete("/delete_post", {
        data: { post_id },
      });

      return { post_id };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

// ================= INCREMENT POST LIKES =================
export const incrementPostLikes = createAsyncThunk(
  "post/incrementPostLikes",
  async (post_id, thunkAPI) => {
    try {
      const res = await clientServer.post("/increment_post_likes", {
        post_id,
      });
      return { post_id };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to like post",
      );
    }
  },
);

// ================= GET COMMENTS BY POST =================
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async ({ post_id }, thunkAPI) => {
    try {
      const res = await clientServer.get("/get_comments", {
        params: { post_id },
      });

      return {
        post_id,
        comments: res.data.comments,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch comments",
      );
    }
  },
);

// ================= POST COMMENT =================
export const postComment = createAsyncThunk(
  "post/postComment",
  async ({ post_id, body }, thunkAPI) => {
    try {
      const res = await clientServer.post("/comment", {
        post_id,
        commentBody: body,
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to post comment",
      );
    }
  },
);

// ================= DELETE COMMENT =================
export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async ({ comment_id }, thunkAPI) => {
    try {
      const res = await clientServer.delete("/delete_comment", {
        data: { comment_id },
      });

      return { comment_id };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);
