import { BrowserRouter,Route,Routes } from 'react-router-dom';
import './App.css';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<RegisterPage />}></Route>
          <Route path='/signup' element={<LoginPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
