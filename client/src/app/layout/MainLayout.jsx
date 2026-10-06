
import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';

const MainLAyout = () => {
    return <div>
        <Navbar />
        <Outlet />
    </div>
}

export default MainLAyout