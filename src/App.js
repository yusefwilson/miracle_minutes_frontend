import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export const LOGIN_CONTEXT = createContext({ logged_in: false, set_logged_in: () => { } }); //declare context with filler values

//axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.baseURL = 'https://e8ps8qunza.execute-api.us-east-1.amazonaws.com/api';

const refresh_access_token = async () =>
{
  try {
    const cookie_refresh_token = Cookies.get('miracle_minutes_refresh_token');

    if (cookie_refresh_token) {
      const refresh_token_result = await axios.post('/refresh', { refresh_token: cookie_refresh_token });
      const access_token = refresh_token_result.data.access_token;

      return access_token;
    }

    return undefined;
  }

  catch (error) {
    Cookies.remove('miracle_minutes_access_token');
    Cookies.remove('miracle_minutes_refresh_token');
    return undefined;
  }
}

export default function App()
{
  const [logged_in, set_logged_in] = useState(null);

  useEffect(() => 
  {
    async function check_tokens_and_login()
    {
      console.log('checking tokens and logging in');
      // refresh tokens
      const access_token = await refresh_access_token();

      if (access_token) {
        Cookies.set('miracle_minutes_access_token', access_token, { expires: 1, path: '/' });

        // now check if token valid
        const user_token_result = await axios.post('/user', { access_token });
        const token_valid = !user_token_result.data.hasOwnProperty('error');

        //if so, log in
        set_logged_in(token_valid);
      }

      // if refreshing failed, abort and just set logged in to false
      else {
        console.log('refreshing failed');
        set_logged_in(false);
        Cookies.remove('miracle_minutes_refresh_token');
        Cookies.remove('miracle_minutes_access_token');
      }
    }
    check_tokens_and_login();
  }, []);

  return (
    logged_in === null ?

      <div className='flex justify-center items-center h-screen bg-white'>
        <img src='/gif/breathing_hourglass.gif' alt='Loading...' width='512' />
      </div>

      :

      <LOGIN_CONTEXT.Provider value={{ logged_in, set_logged_in }}>
        <Router>
          <div className='flex flex-col justify-center bg-white h-screen'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/dashboard/:component' element={<Dashboard />} />
              <Route path='/dashboard/' element={<Dashboard />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/forgot' element={<ForgotPassword />} />
              <Route path='/reset' element={<ResetPassword />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
        </Router>
      </LOGIN_CONTEXT.Provider>
  );
}