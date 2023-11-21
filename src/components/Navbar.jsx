import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../App';
import Cookies from 'js-cookie';

export default function Navbar()
{

  //get the login state and the function to set the login state from the context
  const {loggedIn, setLoggedIn} = useContext(LoginContext);

  const logout = () =>
  {
    setLoggedIn(false);
    //remove the token cookies
    Cookies.remove('miracle_minutes_refresh_token');
    Cookies.remove('miracle_minutes_access_token');
  }

  return (
    <div className='flex bg-red-200 justify-center'>
        <nav className='flex gap-x-2.5'>
            <Link to='/'>Home</Link>
            {loggedIn ? <Link to='/dashboard'>Dashboard</Link> : <Link to='/login'>Login</Link>}
            {loggedIn ? null : <Link to='/signup'>Signup</Link>}
            {loggedIn ? <Link to='/' onClick={logout}>Logout</Link> : null}
        </nav>
    </div>
  );
}