import { createBrowserRouter } from "react-router";
import HomePage from "../features/products/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

import AuthLayout from "./layout/AuthLayout";
import App from "../App";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import SellerRoutes from "../routes/SellerRoutes";
import SellerDashboardPage from "../features/products/pages/SellerDashboardPage";
import MainLayout from "../app/layout/MainLayout";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import ProductFormPage from "../features/products/pages/ProductFormPage";


const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <MainLayout />,
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
                                    {
                                        path: "/seller/products/new",
                                        element: <ProductFormPage />
                                    },
                                    {
                                        path: "/seller/products/:id/edit",
                                        element: <ProductFormPage />
                                    }
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