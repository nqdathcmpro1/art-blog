import axios from "axios";
import store from "@/store";
import { refreshTokenThunk } from "@/thunks/authThunk";

const instance = axios.create({
  baseURL: "http://localhost:5000",
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

/* instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const config = err.config;
    if (err.response?.status === 401 && !config._retry) {
      config._retry = true;

      const newAccessToken = await store.dispatch(refreshToken());
      if (newAccessToken.meta.requestStatus === "fulfilled") {
        config.headers.Authorization = `Bearer ${newAccessToken.payload.data}`;
      }
      if (newAccessToken) return axios(config);
    }
    return Promise.reject(err);
  }
); */

/* instance.interceptors.response.use((res) => {
  return res;
}, async (err) => {
  const config = err.config;
    if (err.response?.status === 401 && !config._retry) {
      config._retry = true;
      const refreshToken = store.getState().authReducer.refreshToken;
      const newAccessToken = await store.dispatch(refreshTokenThunk(refreshToken));
      console.log(newAccessToken)
      if (newAccessToken.meta.requestStatus === "fulfilled") {
        config.headers.Authorization = `Bearer ${newAccessToken.payload.data}`;
      }
      if (newAccessToken) return axios(config);
    }
    return Promise.reject(err);
}); */

export default instance;
