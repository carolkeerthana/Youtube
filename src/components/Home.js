import { Link, Outlet } from "react-router-dom";

const HomePage= () =>{
return(
    <div>
        <h1>Home</h1>
        <nav>
        <Link to="/signup">SIGN UP</Link><br/>
        <Link to="/signin">SIGN IN</Link>
        </nav>
        <Outlet/>
    </div>
)
}

export default HomePage;