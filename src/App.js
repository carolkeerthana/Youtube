import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RegisterPage, {action as registerAction} from './Pages/Register/RegisterPage';
import LoginPage, { action as loginAction} from './Pages/Login/LoginPage';
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
        element: <RegisterPage />,
        action: registerAction
      },
      {
        path: '/signin',
        element: <LoginPage />,
        action: loginAction
      },

    ]
  }
])
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
