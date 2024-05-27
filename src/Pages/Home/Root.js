    import { Outlet, useLocation } from "react-router-dom";
    import Navbar from "../../components/Navbar/Navbar";
import { useState } from "react";

    const RootLayout = () => {

        const location = useLocation();
        const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup'
        || location.pathname === '/forgotpassword';

        return (
            <div>
                {!hideNavbar && <Navbar />}
                <Outlet />
            </div>
        )
    }

    export default RootLayout;