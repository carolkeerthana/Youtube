import {RouterProvider,createBrowserRouter } from 'react-router-dom';
import './App.css';
import RegisterPage from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage';
import ErrorPage from './Pages/Error/ErrorPage';
import HomePage from './Pages/Home/Home';
import RootLayout from './Pages/Home/Root';
import ForgotPassword from './Pages/Forgot_Password/ForgotPassword';
import ResetPassword from './Pages/Reset_Password/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/signup',
        element: <RegisterPage />
      },
      {
        path: '/signin',
        element: <LoginPage />
      },
      {
        path: '/forgotpassword',
        element: <ForgotPassword />
      },
      {
        path: '/resetpassword',
        element: <ResetPassword />
      },
    ]
  }
])
function App() {
  return (
    <div>
      <RouterProvider router={router} />,
    </div>
  );
}

export default App;
