import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";


const SellerRoutes = () => {

    const { user } = useSelector(state => state.auth);

    if (user?.role !== "seller") { 
        return <Navigate to={"/"} replace />
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default SellerRoutes