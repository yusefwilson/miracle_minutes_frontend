import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import axios from 'axios';

// componentss
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';

export const LoginContext = createContext({loggedIn: false, setLoggedIn: (newValue) => {}}); //declare context with filler values

axios.defaults.baseURL = 'http://localhost:3001/api';

const refresh_access_token = async () =>
{
  try
  {
    const cookie_refresh_token = Cookies.get('miracle_minutes_refresh_token');

    if (cookie_refresh_token)
    {
      const refresh_token_result = await axios.post('/refresh', {refresh_token: cookie_refresh_token});
      const access_token = refresh_token_result.data.access_token;

      return access_token;
    }

    return undefined;
  }
  
  catch (error)
  {
    Cookies.remove('miracle_minutes_access_token');
    Cookies.remove('miracle_minutes_refresh_token');
    return undefined;
  }
}

export default function App()
{
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => 
  {
    async function check_tokens_and_login()
    {
      // refresh tokens
      const access_token = await refresh_access_token();

      if(access_token)
      {
        Cookies.set('miracle_minutes_access_token', access_token, {expires: 1, path: ''});
        
        // now check if token valid
        const verify_token_result = await axios.post('/verify_token', {access_token});
        const token_valid = !verify_token_result.data.hasOwnProperty('error');

        //if so, log in
        setLoggedIn(token_valid);
      }

      // if refreshing failed, abort and just set logged in to false
      else
      {
        Cookies.remove('miracle_minutes_refresh_token');
        Cookies.remove('miracle_minutes_access_token');
      }
    }
    check_tokens_and_login();
  }, []);

  return (
    <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
      <Router>
        <div className="flex flex-col justify-center bg-gray-600 h-screen">
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/verify' element={<Verify/>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LoginContext.Provider>
  );
}