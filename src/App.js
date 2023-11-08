import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const LoginContext = createContext({loggedIn: false, setLoggedIn: () => {}}); //declare context with filler values

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
      <div className="App">
        <Login />
        <Signup />
      </div>
    </LoginContext.Provider>
  );
}