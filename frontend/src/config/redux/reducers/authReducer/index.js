import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  sendConnectionRequest,
  getSentRequests,
  getReceivedRequests,
  getConnections,
  acceptConnectionRequest,
} from "../../action/authAction";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  loggedIn: false,
  message: "",

  profileFetched: false,
  all_users: [],
  all_profile_fetched: false,

  sentRequests: [],
  receivedRequests: [],
  connections: [],
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
      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedIn = true;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Registration successful, please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= USER PROFILE =================
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.profileFetched = true;
        state.user = action.payload;
      })

      // ================= ALL USERS =================
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.all_users = action.payload;
        state.all_profile_fetched = true;
      })

      // ================= SEND CONNECTION =================
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload?.message || "Request sent";
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= SENT REQUESTS =================
      .addCase(getSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload;
      })

      // ================= RECEIVED REQUESTS =================
      .addCase(getReceivedRequests.fulfilled, (state, action) => {
        state.receivedRequests = action.payload;
      })

      // ================= CONNECTIONS =================
      .addCase(getConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })

      // ================= ACCEPT / REJECT =================
      .addCase(acceptConnectionRequest.fulfilled, (state) => {
        state.message = "Request updated";
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, setTokenNotThere } =
  authSlice.actions;

export default authSlice.reducer;
