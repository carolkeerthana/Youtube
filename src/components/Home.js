import { Link, Outlet, useLocation } from "react-router-dom";

const HomePage= () =>{
    const location = useLocation();

    const isSignInOrSignUp = location.pathname === '/signin' || location.pathname === '/signup';
    
return(
    <div>
        {!isSignInOrSignUp && (
        <>
        <h1>Home</h1>
        <nav>
        <Link to="/signin">SIGN IN</Link>
        </nav>
        </>
        )}
        <Outlet/>
    </div>
)
}

export default HomePage;