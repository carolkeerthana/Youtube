import {Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RegisterPage, {action as registerAction} from './Pages/Register/RegisterPage';
import LoginPage, { action as loginAction} from './Pages/Login/LoginPage';
import ErrorPage from './Pages/Error/ErrorPage';
import HomePage from './Pages/Home/Home';
import RootLayout from './Pages/Home/Root';
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
//         element: <RegisterPage />,
//         action: registerAction
//       },
//       {
//         path: '/signin',
//         element: <LoginPage />,
//         action: loginAction
//       },

//     ]
//   }
// ])
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<RegisterPage/>} action={registerAction}/>
        <Route path='/signin' element={<LoginPage/>} action={loginAction}/>
        <Route path='*' element={<ErrorPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
