import { readAccessToken } from "../utils/tokens.js";

export const authenticate = (req, res, next) => { 
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {  
        return res.status(401).json({
            message: "Access token not found in the request header",
        })
    }

    try {
        const decoded = readAccessToken(accessToken);
        req.user = decoded;

        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        })
    }
}



export const validateSeller = (req, res, next) => { 
    if (req.user.role !== "seller") { 
        return res.status(403).json({
            message: "User is not authorized to perform this action",
        })
    }

    next();
}