import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const RootLayout = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup';
    return (
        <div>
            {!hideNavbar && <Navbar />}
            <Outlet />
        </div>
    )
}

export default RootLayout;