import axios from "axios";

// This file sets up an Axios instance for making HTTP requests
const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5001/api" : "/api", // base URL for API requests
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
