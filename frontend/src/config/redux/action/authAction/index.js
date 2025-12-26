import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ============== Login User ============== //
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "No token Provided!",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ============== Register User ============== //
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        email: user.email,
        password: user.password,
        username: user.username,
        name: user.name,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ============== Getting All About User ============== //
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ============== Getting All Users ============== //
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ============== Sending Connection Request ============== //
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );

      console.log("request Send Successfully!");

      thunkAPI.dispatch(getConnectionRequest({ token: user.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// ============== Getting Connection Request ============== //
export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/get_my_connection_request",
        {
          params: {
            token: user.token,
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// ============== Getting My Connection Request ============== //
export const getMyConnectionRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// ============== Accept Connection Request ============== //
export const acceptConnectionRequest = createAsyncThunk(
  "user/acceptConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/accept_connection_request",
        {
          token: user.token,
          requestId: user.connectionId,
          action_type: user.action,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
