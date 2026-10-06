import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "name must be minimum 3 characters long"],
        maxLength: [50, "name must be maximum 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must be minimum 6 characters long"],
    },
    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user",
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });


export const UserModel = mongoose.model("user", UserSchema);