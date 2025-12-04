// api.js
import axios from "axios";
import { BACKEND_URL } from "../constans/index";

console.log("Backend:", BACKEND_URL);

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,  // <-- IMPORTANT (Cookies send/receive)
  headers: {
    "Content-Type": "application/json"
  }
});

// -------------- REQUEST INTERCEPTOR ---------------- //

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// -------------- RESPONSE INTERCEPTOR ---------------- //

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    // Agar 401 + NOT RETRIED
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token request (COOKIE SE REFRESH TOKEN JAYEGA)
        const res = await axios.post(
          `${BACKEND_URL}/auth/refresh`,
          {},
          {
            withCredentials: true // <-- cookies include
          }
        );

        const newToken = res.data.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newToken);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry request
      } catch (err) {
        console.log("REFRESH FAILED", err);

        // Logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
