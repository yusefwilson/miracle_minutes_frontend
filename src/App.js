import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { createContext, useState } from 'react';

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
  });

  return (
    <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
      <div className="App">
        <Login />
        <Signup />
      </div>
    </LoginContext.Provider>
  );
}