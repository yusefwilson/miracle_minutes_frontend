import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LOGIN_CONTEXT } from '../App';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Navbar()
{
  //get the login state and the function to set the login state from the context
  const {logged_in, set_logged_in} = useContext(LOGIN_CONTEXT);
  const navigate = useNavigate();
  
  const button_style_string = 'hover:bg-gray-400 rounded p-4';

  const logout = () =>
  {
    set_logged_in(false);
    //remove the token cookies
    Cookies.remove('miracle_minutes_refresh_token');
    Cookies.remove('miracle_minutes_access_token');
  }

  return (
    <div className='flex shrink-0 flex-row bg-gradient-to-b from-purple-500 justify-between p-2 z-10'>
      <div className='flex items-center'>
        <img className='cursor-pointer' src='/img/hourglass_purple_transparent.png' alt='Logo' width='64' onClick={() => navigate('/')}/>
        <Link className={button_style_string} to='/'>Home</Link>
      </div>
      <div className='flex items-center'>
        {logged_in ? <Link className={button_style_string} to='/dashboard'>Dashboard</Link> : <Link className={button_style_string} to='/login'>Log in</Link>}
        {logged_in ? null : <Link className={button_style_string} to='/signup'>Sign up</Link>}
        {logged_in ? <Link className={button_style_string} to='/' onClick={logout}>Logout</Link> : null}
      </div>          
    </div>
  );
}