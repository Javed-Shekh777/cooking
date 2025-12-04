// api.js
import axios from "axios";
import { BACKEND_URL } from "../constans/index";
console.log(BACKEND_URL);
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});


console.log(api);
 


// Request interceptor
api.interceptors.request.use((config) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
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


// import axios from "axios";
// import { BACKEND_URL } from "../constans/index";
// // सुनिश्चित करें कि आप constans के बजाय constants से import कर रहे हैं
// // import { BACKEND_URL } from "../constants/index"; 

// const api = axios.create({
//   baseURL: BACKEND_URL,
//   withCredentials: true,
// });

// // Request interceptor
// api.interceptors.request.use((config) => {
//   try {
//     // localStorage से सीधे स्ट्रिंग प्राप्त करें, JSON.parse की आवश्यकता नहीं है 
//     // यदि आप इसे स्ट्रिंग के रूप में सहेज रहे हैं (जो आमतौर पर होता है)
//     const accessToken = localStorage.getItem("accessToken"); 

//     if (accessToken) {
//       // Bearer टोकन प्रारूप सुनिश्चित करें
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//   } catch (err) {
//     console.error("Error accessing accessToken in localStorage:", err);
//   }
//   return config;
// }, (error) => {
//   // Request error handling
//   return Promise.reject(error);
// });

// // Response interceptor
// api.interceptors.response.use(
//   (res) => res, // Successful response handler (no changes)
//   async (error) => {
//     const originalRequest = error.config;
//     // टोकन रीफ़्रेश लॉजिक केवल तभी चलाएँ जब status 401 हो और हमने पहले से कोशिश न की हो
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // भविष्य की कोशिशों को रोकने के लिए फ़्लैग सेट करें

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");

//         if (!refreshToken) {
//            throw new Error("No refresh token available. User must re-authenticate.");
//         }

//         // हिट रिफ्रेश एंडपॉइंट
//         const res = await axios.post(
//           `${BACKEND_URL}/refresh`, // सुनिश्चित करें कि यह आपका सही रिफ्रेश एंडपॉइंट URL है
//           { refreshToken },
//           { withCredentials: true }
//         );

//         const { accessToken: newToken } = res.data.data;

//         if (!newToken) throw new Error("Refresh endpoint did not return new token.");

//         // localStorage अपडेट करें
//         localStorage.setItem("accessToken", newToken);

//         // मूल अनुरोध (original request) के हेडर में नया टोकन जोड़ें
//         // (Axios headers case-insensitive होते हैं, 'Authorization' मानक है)
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         // मूल अनुरोध को नए टोकन के साथ फिर से चलाएँ
//         return api(originalRequest); 

//       } catch (err) {
//         console.error("Error refreshing token or handling logout:", err.message || err);
//         // ✅ महत्वपूर्ण: यदि रीफ़्रेश विफल हो जाता है, तो उपयोगकर्ता को लॉग आउट करें
//         // यह वह जगह है जहाँ आप Redux store को अपडेट कर सकते हैं या logout action dispatch कर सकते हैं
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken"); // Assuming you save refresh token separately

//         // सुनिश्चित करें कि त्रुटि आगे भी फैलती है
//         return Promise.reject(err);
//       }
//     }
//     // अन्य सभी त्रुटियों (403, 404, 500, etc.) को पास करें
//     return Promise.reject(error);
//   }
// );

// export default api;
