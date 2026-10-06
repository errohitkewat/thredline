import { createBrowserRouter } from "react-router";
import HomePage from "../features/products/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

import AuthLayout from "./layout/AuthLayout";
import App from "../App";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import SellerRoutes from "../routes/SellerRoutes";
import SellerDashboardPage from "../features/products/pages/SellerDashboardPage";
import MainLAyout from "./layout/MainLayout";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";


const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <MainLAyout />,
                children: [
                    {
                        path: "/",
                        element: <HomePage />
                    },
                    {
                        path: "/products/:id",
                        element: <ProductDetailPage />
                    },
                    {
                        element: <ProtectedRoutes />,
                        children: [
                            {
                                element: <SellerRoutes />,
                                children: [
                                    {
                                        path: "/seller",
                                        element: <SellerDashboardPage />
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "/login",
                        element: <LoginPage />
                    },
                    {
                        path: "/register",
                        element: <RegisterPage />
                    }
                ]
            }
        ]
    }
])

export default router;