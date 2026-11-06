
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 15000,
});

// Request interceptor: Add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.code === "ECONNABORTED") {
      console.log("Request timed out:", error.message);
    } else if (error.request) {
      console.log("No response received from server:", error.message);
    } else {
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
