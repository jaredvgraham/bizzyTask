// lib/axios.ts
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken(true);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosPrivate(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosPublic, axiosPrivate };
