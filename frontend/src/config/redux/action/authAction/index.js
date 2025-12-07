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
  async (user, thunkAPI) => {}
);
