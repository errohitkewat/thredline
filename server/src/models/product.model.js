import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        minLength: 20,
        maxLength: 500,
    },
    images: {
        type: [{
            url: {
                type: String,
                required: true,
            },
            fileId: {
                type: String,
                required: true,
            }
        }],
        validate: {
            validator: (images) => images.length <= 7,
            message: "A product can have only 7 images",
        }
    },

    price: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["INR", "USD"],
            default: "INR",
            required: true
        }
    },

    sizes: [
        {
            size: {
                type: String,
                required: true,
                enum: ["XS", "S", "M", "L", "XL", "XXL"],
            },
            stock: {
                type: Number,
                min: 0,
                default: 0,
            }
        }
    ],

    seller: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },

    published: {
        type: Boolean,
        default: false,
    },
})



export const ProductModel = mongoose.model("products", productSchema);




