import axios from "axios";
import store from "@/store";
import { refreshToken } from "./authApi";
import { refreshTokenThunk } from "@/thunks/authThunk";

const instance = axios.create({
  baseURL: "https://art-blog-demo.onrender.com/", /* "http://127.0.0.1:5000", */
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Origin, Authorization",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


instance.interceptors.request.use(
  (req) => {
    const accessToken = store.getState().authReducer.accessToken;
    req.headers.Authorization = "Bearer " + accessToken;
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);


instance.interceptors.response.use((res) => {
  return res;
}, async (err) => {
  const config = err.config;
    if (err.response?.status === 401 && !config._retry) {
      config._retry = true;
      const getRefreshToken = await store.getState().authReducer.refreshToken;
      const newAccessToken = await store.dispatch(refreshTokenThunk(getRefreshToken))
      if (newAccessToken.payload.status === 200) {
        config.headers.Authorization = `Bearer ${newAccessToken.payload.data.data}`;
      }
      return axios(config);
    }
    return Promise.reject(err);
});

export default instance;
