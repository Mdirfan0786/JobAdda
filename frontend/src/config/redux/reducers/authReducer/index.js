import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequest,
  loginUser,
  registerUser,
  sendConnectionRequest,
} from "../../action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profile_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,

    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload.user;
        state.message = "Login Successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = {
          message: "Registration Successful, Please Login",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Something Went Wrong!";
      })

      // handling User Details
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
      })

      // Fetching All users
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profile_fetched = true;
        state.all_users = action.payload.profile;
      })

      // Getting Connection Request
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.connections = action.payload;
        } else if (action.payload?.connections) {
          state.connections = action.payload.connections;
        } else if (action.payload) {
          state.connections = [action.payload];
        } else {
          state.connections = [];
        }
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })

      // getting My Connection Requests
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.connectionRequest = action.payload;
        } else if (action.payload?.connectionRequest) {
          state.connectionRequest = action.payload.connectionRequest;
        } else if (action.payload) {
          state.connectionRequest = [action.payload];
        } else {
          state.connectionRequest = [];
        }
      })
      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })

      // SEND CONNECTION REQUEST
      .addCase(sendConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.message = "Sending connection request...";
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Request sent successfully!";
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to send connection request";
      });
  },
});

export const { reset, emptyMessage, setTokenNotThere, setTokenIsThere } =
  authSlice.actions;
export default authSlice.reducer;
