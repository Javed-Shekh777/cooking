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

// api.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");
//   console.log(accessToken);

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});


// -------------- RESPONSE INTERCEPTOR ---------------- //

// api.interceptors.response.use(
//   (res) => res,

//   async (error) => {
//     const originalRequest = error.config;

//     // Agar 401 + NOT RETRIED
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Refresh token request (COOKIE SE REFRESH TOKEN JAYEGA)
//         const res = await axios.post(
//           `${BACKEND_URL}/auth/refresh`,
//           {},
//           {
//             withCredentials: true // <-- cookies include
//           }
//         );

//         const newToken = res.data.data.accessToken;

//         // Save new access token
//         localStorage.setItem("accessToken", newToken);

//         // Update header
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return api(originalRequest); // retry request
//       } catch (err) {
//         console.log("REFRESH FAILED", err);

//         // Logout user
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("user");

//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );




api.interceptors.response.use(
  (response) => { console.log(response); return response },

  async (error) => {
    console.log("Axios Error:",error);
    const originalRequest = error.config;

    const isAuthRoute = AUTH_EXCLUDED_ROUTES.some((route) =>
      originalRequest.url.includes(route)
    );

    // ❌ Auth routes pe refresh mat karo
    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // ✅ Sirf protected API ke liye refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);




export default api;
