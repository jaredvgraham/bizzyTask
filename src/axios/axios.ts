import axios from "axios";
import { getAuth } from "firebase/auth";

// Public axios instance for requests that don't require authentication
const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Server-side axios instance (if applicable)
const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

// Private axios instance for requests that require authentication
const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Interceptor to attach the token to every request
axiosPrivate.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        console.log("Retrieved token:", token); // Log the token for debugging
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting token:", error);
        // Optionally, you might want to redirect the user to the login page if token retrieval fails
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Interceptor to handle token expiration and refresh
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const token = await user.getIdToken(true);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosPrivate(originalRequest);
        } catch (tokenError) {
          console.error("Token refresh failed:", tokenError);
        }
      }
    }

    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

export { axiosPublic, axiosPrivate, axiosServer };
