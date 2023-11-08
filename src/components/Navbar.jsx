import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../App';

export default function Navbar()
{

  //get the login state and the function to set the login state from the context
  const {loggedIn, setLoggedIn} = useContext(LoginContext);

  const logout = () =>
  {
    setLoggedIn(false);
    //remove the token cookie
    document.cookie="miracle_minutes_token=; expires=Sun, 20 Aug 2000 12:00:00 UTC";  
  }

  return (
    <div className="">
        <nav className="">
            <ul>
            <li><Link to="/">Home</Link></li>
            {loggedIn ? <li><Link to="/dashboard">Dashboard</Link></li> : <li><Link to="/login">Login</Link></li>}
            {loggedIn ? <li><Link to="/signup">Signup</Link></li> : <li><Link to="/signup">Signup</Link></li>}
            {loggedIn ? <li><Link to="/logout" onClick={logout}>Logout</Link></li> : <div></div>}
            </ul>
        </nav>
    </div>
  );
}