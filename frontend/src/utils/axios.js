// api.js
import axios from "axios";
import { BACKEND_URL } from "../constans/index";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

 


// Request interceptor
api.interceptors.request.use((config) => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }
  } catch (err) {
    console.error("Error parsing accessToken:", err);
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const savedRefresh = localStorage.getItem("refreshToken");
        const refreshToken = savedRefresh ?  savedRefresh : null;

        if (!refreshToken) throw new Error("No refresh token");

        // Hit refresh endpoint
        const res = await axios.post(
          `${BACKEND_URL}/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken: newToken } = res.data.data;

        // Update localStorage
        localStorage.setItem("accessToken",  newToken);

        // Attach new token to request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        // Clear storage & logout
        // localStorage.removeItem("loginUserData");
        // localStorage.removeItem("accessToken");

      }
    }

    return Promise.reject(error);
  }
);

export default api;
