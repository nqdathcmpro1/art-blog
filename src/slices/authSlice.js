import { createSlice } from "@reduxjs/toolkit";

import { loginThunk, refreshTokenThunk, logoutThunk } from "@/thunks/authThunk";

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
        state.accessToken = action.payload.data.data;
      })

      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loginUser = null;
        state.accessToken = null;
        state.refreshToken = null;
      })

      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.loginUser = null;
        state.accessToken = null;
        state.refreshToken = null;
      }),
});
