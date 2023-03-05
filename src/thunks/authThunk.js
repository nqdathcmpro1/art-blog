import { createAsyncThunk } from "@reduxjs/toolkit";

import { loginUser, refreshToken, logoutUser } from "@/api/authApi";

export const loginThunk = createAsyncThunk(
  "authSlice/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const data = await loginUser(user);
      return data;
    } catch (err) {
      if (err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "authSlice/refreshToken",
  async (token) => {
    const data = await refreshToken(token);
    return data;
  }
);

export const logoutThunk = createAsyncThunk(
  "authSlice/logoutUser",
  async (userId) => {
    const data = await logoutUser(userId);
    return data
  }
);
