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

const refresh_tokens = async () =>
{
  try
  {
    const cookie_refresh_token = Cookies.get('miracle_minutes_refresh_token');
    console.log("IN TRY");
    console.log("REFRESH TOKEN: \n" + cookie_refresh_token);

    if (cookie_refresh_token)
    {
      console.log("REFRESH TOKEN: \n" + cookie_refresh_token);
      const refresh_token_result = await axios.post('/refresh', {refresh_token: cookie_refresh_token});
      console.log("REFRESH TOKEN RESULT: \n" + refresh_token_result.data);
      const {id_token, refresh_token} = refresh_token_result.data;
      return {id_token, refresh_token};
    }

    else
    {
      console.log('removing tokens 1');
      Cookies.remove('miracle_minutes_id_token');
      Cookies.remove('miracle_minutes_refresh_token');
    }

    return undefined;
  }
  
  catch (error)
  {
    console.log(error);
    console.log('removing tokens 2');
    Cookies.remove('miracle_minutes_id_token');
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
      const refresh_result = await refresh_tokens();

      if(refresh_result)
      {
        Cookies.set('miracle_minutes_refresh_token', refresh_result.refresh_token, {expires: 30, path: ''});
        Cookies.set('miracle_minutes_id_token', refresh_result.id_token, {expires: 1, path: ''});
      }

      // if refreshing failed, abort and just set logged in to false
      else { return; }

      // now check if token valid
      const id_token = Cookies.get('miracle_minutes_id_token');
      const verify_token_result = await axios.post('/verify_token', {id_token: id_token});
      const token_valid = !verify_token_result.data.hasOwnProperty('error');

      //if so, log in
      setLoggedIn(token_valid);
    }
    check_tokens_and_login();
  }, []);

  return (
    <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
      <Router>
        <div className="flex flex-col bg-gray-600 h-screen">
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