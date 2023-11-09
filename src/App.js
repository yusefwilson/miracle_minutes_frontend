import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import axios from 'axios';

// componentss
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

export const LoginContext = createContext({loggedIn: false, setLoggedIn: (newValue) => {}}); //declare context with filler values

axios.defaults.baseURL = 'http://localhost:3001/api';

export default function App()
{
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => 
  {
    const token = Cookies.get('miracle_minutes_token');
    if(token)
    {
      setLoggedIn(true);
    }
  }, []);

  return (
    <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
      <Router>
        <div className="flex flex-col gap-y-2.5">
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LoginContext.Provider>
  );
}