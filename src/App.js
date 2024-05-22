import {RouterProvider,createBrowserRouter } from 'react-router-dom';
import './App.css';
import RegisterPage from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage';
import ErrorPage from './Pages/Error/ErrorPage';
import HomePage from './Pages/Home/Home';
import RootLayout from './Pages/Home/Root';

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
