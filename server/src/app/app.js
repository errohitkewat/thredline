import express from "express"
import cookieParser from "cookie-parser";
import { connectDb } from "../config/connectDb.js";
import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/product.routes.js";


const app = express();
app.use(express.json());
app.use(cookieParser());


await connectDb();


app.get("/", (req, res) => { 
    return res.status(200).json({
        message: "Server is running",
    })
})


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


export default app;