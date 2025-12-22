// api.js
import axios from "axios";
import { BACKEND_URL } from "../constans/index";
import { clearAccessToken, getAccessToken, setAccessToken } from "../services/tokenService";

const AUTH_EXCLUDED_ROUTES = [
  "/auth/locallogin",
  "/auth/localregister",
  "/auth/verify",
  "/auth/refresh"
];

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,  // <-- IMPORTANT (Cookies send/receive)
  headers: {
    "Content-Type": "application/json"
  }
});

// -------------- REQUEST INTERCEPTOR ---------------- //


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  response => { console.log("Axios Response:", response); return response },
  async error => {
    console.log("Axios Error:", error);
    const originalRequest = error.config;
    const status = error.response?.status;

    // Network/server error
    if (!error.response) return Promise.reject("Server not reachable");

    const isAuthRoute = AUTH_EXCLUDED_ROUTES.some(route =>
      originalRequest.url.includes(route)
    );
    if (isAuthRoute) return Promise.reject(error); // Auth routes pe refresh na karo

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token");

        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        // Instead of redirect here, update redux state and let component handle redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
