
import { axiosInstance } from "../../../lib/axiosInstance";

// Login
export const loginUser = async (credentials) => { 
    const response = await axiosInstance.post("/auth/login", credentials);

    return response.data;
}


// Register
export const registerUser = async (userData) => { 
    const response = await axiosInstance.post("/auth/register", userData);

    return response.data;
}


// Logout
export const logoutUser = async () => { 
    const response = await axiosInstance.post("/auth/logout");

    return response.data;
}



// Refresh Access Token
export const refreshAccessToken = async () => { 
    const response = await axiosInstance.post("/auth/refresh");

    return response.data.accessToken;
}



// Get me 
export const getMe = async () => { 
    const response = await axiosInstance.get("/auth/me");

    return response.data;
}