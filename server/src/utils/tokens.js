import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


export const generateTokens = ({ id, role }) => { 
    const accessToken = jwt.sign({ id, role }, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id, role }, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return {
        accessToken,
        refreshToken,
    }
}


export const readAccessToken = (accessToken) => { 
    return jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
}


export const readRefreshToken = (refreshToken) => { 
    return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}


