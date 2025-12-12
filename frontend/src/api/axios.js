// src/api/axios.js
import axios from "axios";

// --- BASE URL (Update to your backend URL) ---
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://payway-com-backend.onrender.com";

// --- Create axios instance ---
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allows cookies (if you use them)
});

// --- Request Interceptor (Add token automatically) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (Handle expired tokens) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Token expired or unauthorized");

      // Remove token + redirect user (optional)
      localStorage.removeItem("token");

      // Optionally redirect to login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
