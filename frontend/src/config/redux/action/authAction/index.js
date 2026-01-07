import { clientServer } from "@/config";
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
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      await clientServer.post("/register", user);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ================= ABOUT USER =================
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.get("/get_user_and_profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
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
  }
);

// ================= SEND CONNECTION =================
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/send_connection_request", {
        token: user.token,
        connectionId: user.user_id,
      });

      if (res.data.alreadySent) {
        alert("already sent");
      } else {
        alert("request sent");
      }
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Server error");
    }
  }
);

// ================= SENT REQUESTS =================
export const getSentRequests = createAsyncThunk(
  "user/getSentRequests",
  async (token, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/sent_requests", {
        params: { token },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ================= RECEIVED REQUESTS =================
export const getReceivedRequests = createAsyncThunk(
  "user/getReceivedRequests",
  async (token, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/received_requests", {
        params: { token },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ================= CONNECTIONS =================
export const getConnections = createAsyncThunk(
  "user/getConnections",
  async (token, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/connections", {
        params: { token },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ================= ACCEPT / REJECT =================
export const acceptConnectionRequest = createAsyncThunk(
  "user/acceptConnectionRequest",
  async ({ token, requestId, action }, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/accept_connection_request", {
        token,
        requestId,
        action_type: action,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
