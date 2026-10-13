import dotenv from "dotenv";
dotenv.config();


export const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    IMAGE_KIT_PRIVATE_KEY: process.env.IMAGE_KIT_PRIVATE_KEY,
    NODE_ENV: process.env.NODE_ENV,
}