import {Route, RouterProvider,Routes,createBrowserRouter, useLocation } from 'react-router-dom';
import './App.css';
import RegisterPage from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage';
import ErrorPage from './Pages/Error/ErrorPage';
import HomePage from './Pages/Home/Home';
import RootLayout from './Pages/Home/Root';
import ForgotPassword from './Pages/Forgot_Password/ForgotPassword';
import ResetPassword from './Pages/Reset_Password/ResetPassword';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         path: '/signup',
//         element: <RegisterPage />
//       },
//       {
//         path: '/signin',
//         element: <LoginPage />
//       },
//       {
//         path: '/forgotpassword',
//         element: <ForgotPassword />
//       },
//       {
//         path: '/resetpassword',
//         element: <ResetPassword />
//       },
//     ]
//   }
// ])
function App() {
  const [sidebar, setSidebar] = useState(true);
  const location = useLocation();
  const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup'
  || location.pathname === '/forgotpassword';
  
  return (
    <div>
      {!hideNavbar && <Navbar setSidebar={setSidebar}/>}
      <Routes>
        {/* <Route path='/' element={<RootLayout/>} /> */}
        <Route index element={<HomePage  sidebar={sidebar}/>} />
        <Route path='/signup' element={<RegisterPage/>} />
        <Route path='/signin' element={<LoginPage/>} />
        <Route path='/forgotpassword' element={<ForgotPassword/>} />
        <Route path='/resetpassword' element={<ResetPassword/>} />
      </Routes>
    </div>
  );
}

export default App;
