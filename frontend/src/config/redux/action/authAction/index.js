import { clientServer } from "@/config/index";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const res = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed",
      );
    }
  },
);

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      await clientServer.post("/register", user);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed",
      );
    }
  },
);

// ================= ABOUT USER =================
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/get_user_and_profile");
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

// ================= ALL USERS =================
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/get_all_users");
      return res.data.profile;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

// ================= SEND CONNECTION =================
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async ({ connectionId }, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/send_connection_request", {
        connectionId,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Server error",
      );
    }
  },
);

// ================= SENT REQUESTS =================
export const getSentRequests = createAsyncThunk(
  "user/getSentRequests",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/sent_requests");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

// ================= RECEIVED REQUESTS =================
export const getReceivedRequests = createAsyncThunk(
  "user/getReceivedRequests",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/received_requests");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

// ================= CONNECTIONS =================
export const getConnections = createAsyncThunk(
  "user/getConnections",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/connections");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

// ================= ACCEPT / REJECT =================
export const acceptConnectionRequest = createAsyncThunk(
  "user/acceptConnectionRequest",
  async ({ requestId, action }, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/accept_connection_request", {
        requestId,
        action,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);
