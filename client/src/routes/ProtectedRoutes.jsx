import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";


const ProtectedRoutes = () => {

    const { isAuthenticated, initialized } = useSelector(state => state.auth);

    
    if (!initialized) { 
        return <p>Loading....</p>
    }

    if (!isAuthenticated) { 
        return <Navigate to="/login"  replace />
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default ProtectedRoutes