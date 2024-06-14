import {Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import RegisterPage from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage';
import ErrorPage from './Pages/Error/ErrorPage';
import HomePage from './Pages/Home/Home';
import ForgotPassword from './Pages/Forgot_Password/ForgotPassword';
import ResetPassword from './Pages/Reset_Password/ResetPassword';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Video from './Pages/Video/Video';
import { AuthProvider } from './util/AuthContext';

function App() {
  const [sidebar, setSidebar] = useState(true);
  const location = useLocation();
  const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup'
  || location.pathname === '/forgotpassword';
  
  return (
    <div>
      <AuthProvider>
        {!hideNavbar && location.pathname !== '/' && <Navbar setSidebar={setSidebar}/>}
      <Routes>
        <Route path="/*" element={<HomePage  sidebar={sidebar} setSidebar={setSidebar}/>} />
        <Route path='/signup' element={<RegisterPage />} errorElement={<ErrorPage/>}/>
        <Route path='/signin' element={<LoginPage />} errorElement={<ErrorPage/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        {/* <Route path='/resetpassword' element={<ResetPassword />} /> */}
        <Route path='/error' element={<ErrorPage />} />
        <Route path='/watch/:videoId' element={<Video key={location.pathname} sidebar={sidebar} setSidebar={setSidebar}/>} /> 
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
