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
import Plans from './pages/Plans';
import Topics from './components/Topics';
import { has_error } from './helpers';
import Loading from './components/Loading';

//declare contexts with filler values
export const LOGIN_CONTEXT = createContext({ logged_in: false, set_logged_in: () => { } });
export const USER_CONTEXT = createContext({ user: {}, set_user: () => { } });

//axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.baseURL = 'https://e8ps8qunza.execute-api.us-east-1.amazonaws.com/api';

const refresh_access_token = async () =>
{
  try
  {
    const cookie_refresh_token = Cookies.get('miracle_minutes_refresh_token');

    if (cookie_refresh_token)
    {
      console.log('cookie refresh token found');
      const refresh_result = await axios.post('/refresh', { refresh_token: cookie_refresh_token });
      const access_token = refresh_result.data.access_token;

      return access_token;
    }

    console.log('no refresh token found in cookies');
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
  const [logged_in, set_logged_in] = useState(null);
  const [user, set_user] = useState({});

  useEffect(() =>
  {
    async function check_tokens_and_login()
    {
      console.log('checking tokens and logging in');
      // refresh tokens
      const access_token = await refresh_access_token();

      if (access_token)
      {
        Cookies.set('miracle_minutes_access_token', access_token, { expires: 1, path: '/' });

        // now check if token valid
        const user_token_result = await axios.post('/user', { access_token });
        const token_valid = !has_error(user_token_result.data);

        // put user details into context
        if (token_valid)
        {
          set_user(user_token_result.data);
          console.log('token valid, user: ', user_token_result.data);
        }
        set_logged_in(token_valid);
      }

      // if refreshing failed, abort and just set logged in to false
      else
      {
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

      <Loading />

      :

      <LOGIN_CONTEXT.Provider value={{ logged_in, set_logged_in }}>
        <USER_CONTEXT.Provider value={{ user, set_user }}>
          <Router>
            <div className='flex flex-col bg-blue-100 h-screen'>
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
                <Route path='/plans' element={<Plans />} />
                <Route path='/topics' element={<Topics />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </div>
          </Router>
        </USER_CONTEXT.Provider>
      </LOGIN_CONTEXT.Provider>
  );
}