import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RegisterPage, {action as registerAction} from './components/RegisterPage';
import LoginPage, { action as loginAction} from './components/LoginPage';
import ErrorPage from './components/ErrorPage';
import HomePage from './components/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
    children: [
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
    <RouterProvider router={router} />
  );
}

export default App;
