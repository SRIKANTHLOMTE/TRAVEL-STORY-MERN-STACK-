import axios from "axios";
import { BASE_URL } from "./constants";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // http://localhost:3012
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ❗ Do NOT attach token for login & signup
    if (token && !config.url.includes("/login") && !config.url.includes("/create-account")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized → force logout
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      console.error("Network / Server error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
