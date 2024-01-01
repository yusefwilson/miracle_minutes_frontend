import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LOGIN_CONTEXT } from '../App';
import Cookies from 'js-cookie';

export default function Navbar()
{

  //get the login state and the function to set the login state from the context
  const {logged_in, set_logged_in} = useContext(LOGIN_CONTEXT);
  
  const button_style_string = 'hover:text-white hover:bg-purple-200 rounded p-4 ';

  const logout = () =>
  {
    set_logged_in(false);
    //remove the token cookies
    Cookies.remove('miracle_minutes_refresh_token');
    Cookies.remove('miracle_minutes_access_token');
  }

  return (
    <div className='flex flex-row bg-gray-200 justify-between'>
      <div className='flex'>
        <Link className={button_style_string} to='/'>Home</Link>
      </div>
      <div className='flex'>
        {logged_in ? <Link className={button_style_string} to='/dashboard'>Dashboard</Link> : <Link className={button_style_string} to='/login'>Login</Link>}
        {logged_in ? null : <Link className={button_style_string} to='/signup'>Sign Up</Link>}
        {logged_in ? <Link className={button_style_string} to='/' onClick={logout}>Logout</Link> : null}
      </div>          
    </div>
  );
}