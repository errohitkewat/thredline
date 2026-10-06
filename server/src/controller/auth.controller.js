import bcrypt from "bcryptjs";
import { UserModel } from "../models/auth.model.js"
import { generateTokens, readRefreshToken } from "../utils/tokens.js";



// Register controller 
export const registerUserController = async (req, res) => { 
    try {
        const { name, email, password } = req.body;

        const isUserExist = await UserModel.findOne({ email });
    
        if (isUserExist) { 
            return res.status(409).json({
                message: "User already registered",
                errors: [
                    {
                        field: "email",
                        message: "User already exist with this email",
                    }
                ]
            })
        }
    
    
        const user = await UserModel.create({
            name,
            email,
            password: await bcrypt.hash(password, 12),
        });
    
    
        const { accessToken, refreshToken } = generateTokens({ id: user._id, role: user.role });
    
    
        await UserModel.findOneAndUpdate({ email }, {
            refreshToken,
        })
    
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
    
    
        return res.status(201).json({
            message: "User registered successfully",
            data: {
                user: {
                    name: user.name,
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            },
            accessToken,
        })    
    }
    catch (error) {
        return res.status(500).json({
            message: "Registration failed, Something went wrong",
            error: error.message,
        });
    }
}





// Login controller 
export const loginUserController = async (req, res) => { 
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) { 
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) { 
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }


        const { accessToken, refreshToken } = generateTokens({ id: user._id, role: user.role });

        await UserModel.findOneAndUpdate({ email }, {
            refreshToken,
        })


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })


        return res.status(201).json({
            message: "User loggedIn successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            accessToken,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Login failed, something went wrong",
            error: error.message,
        })    
    };
}





// Get ME Controller 
export const getMeController = async (req, res) => { 
    try {
        const { id } = req.user;

        const user = await UserModel.findById(id);

        if (!user) { 
            return res.status(401).json({
                message: "User not found",
            })
        }

        return res.status(200).json({
            message: "User fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}





// Refresh tokens controller
export const refreshTokensController = async (req, res) => { 
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) { 
            return res.status(401).json({
                message: "Refresh token not found in cookies",
            })
        }


        let decoded;
        try {
            decoded = readRefreshToken(refreshToken);
        }
        catch (error) {
            return res.status(401).json({
                message: "Invalid or expired refresh token",
            })
        }


        const user = await UserModel.findById(decoded.id);

        if (!user) { 
            return res.status(401).json({
                message: "Invalid refresh token",
            })
        }


        if (refreshToken !== user.refreshToken) { 
            await UserModel.findByIdAndUpdate(user._id, {
                refreshToken: null,
            })

            return res.status(401).json({
                message: "Invalid refresh token",
            })
        }


        const { accessToken, refreshToken: newRefreshToken } = generateTokens({ id: user._id, role: user.role });

        await UserModel.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken,
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })


        return res.status(200).json({
            message: "Tokens refreshed successfully",
            accessToken,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}





// LogOut controller
export const logOutUserController = async (req, res) => { 
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) { 
            await UserModel.findOneAndUpdate({
                refreshToken
            }, {
                refreshToken: null
            })
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict"
        })


        return res.status(200).json({
            message: "User logged out successfully",
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}