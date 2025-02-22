import axios from "axios";
import { auth } from "@/app/firebase";
import Cookies from "js-cookie";

// Custom setCookie function
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the most recent token from cookies
    const token =
      Cookies.get("token") ||
      Cookies.get("UserToken") ||
      Cookies.get("JudgeToken") ||
      Cookies.get("AdminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is unauthorized and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get current user from Firebase
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user found");
        }

        // Get fresh token from Firebase
        const newToken = await user.getIdToken(true);
        setCookie("token", newToken);

        // Get user role from your API
        const roleResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getRole/`,
          {
            token: newToken,
          }
        );
        const data = roleResponse.data;

        // Set the appropriate token based on role response
        if (data.role === "user") {
          if (data.isAdmin) {
            setCookie("AdminToken", newToken);
            setCookie("role", "admin");
          } else if (data.isFormFilled) {
            setCookie("UserToken", newToken);
            setCookie("role", "user");
          }
        } else if (data.role === "judge") {
          setCookie("JudgeToken", newToken);
          setCookie("role", "judge");
        }

        // Update the token in the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear all tokens
        // document.cookie =
        //   "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // document.cookie =
        //   "UserToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // document.cookie =
        //   "JudgeToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // document.cookie =
        //   "AdminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // document.cookie =
        //   "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("12");
        // Only redirect to login if we're in the browser
        if (typeof window !== "undefined") {
          //   window.location.href = "/login";
          console.log("13");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
