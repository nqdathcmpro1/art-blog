import { createSlice } from "@reduxjs/toolkit";

import { loginThunk, refreshTokenThunk } from "@/thunks/authThunk";

export const authSlice = createSlice({
  name: "authReducer",
  initialState: {
    loading: false,
    loginUser: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.loginUser = action.payload;
    },
    logout: (state) => {
      state.loading = false;
      state.loginUser = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loginUser = action.payload.data.data;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      /* .addCase(refreshTokenThunk.rejected, (state) => {
        state.loginUser = null;
        state.accessToken = null;
        state.refreshToken = null;
      }), */
});
