import axios from "axios";
import { store } from "../app/store";


import { setAccessToken, clearCredentials } from "../features/auth/AuthSlice";


export const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
});




axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken;

        if (accessToken) { 
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);




axiosInstance.interceptors.response.use(
    // 1. Response sahi aaya, to bina kuch kiye aage bhej do
    (response) => {
        return response;
    },

    // 2. Response mein error aaya
    async (error) => {
        const originalRequest = error.config;

        // Kya ye token expire hone wala 401 error hai?
        const isTokenExpired = error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/");

        // Nahi hai, to error jaisa hai waisa hi aage bhej do
        if (!isTokenExpired) {
            return Promise.reject(error);
        }

        // Haan hai, to ek baar refresh karke dobara try karenge
        originalRequest._retry = true;

        try {
            // Naya access token maango
            const response = await axiosInstance.post("/auth/refresh");
            const newAccessToken = response.data.accessToken;

            // Redux mein naya token save karo
            store.dispatch(setAccessToken(newAccessToken));

            // Purani request mein naya token lagao aur dobara bhejo
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Refresh bhi fail hua, matlab user ko logout karna padega
            store.dispatch(clearCredentials());
            return Promise.reject(refreshError);
        }
    }
);




