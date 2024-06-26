import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LOGIN_CONTEXT } from '../App';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Navbar()
{
  //get the login state and the function to set the login state from the context
  const { logged_in, set_logged_in } = useContext(LOGIN_CONTEXT);
  const navigate = useNavigate();

  const login_button_style_string = 'bg-transparent hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';
  const signup_button_style_string = 'bg-black hover:bg-purple-700 text-center text-white font-bold py-2 px-4 border-2 border-black rounded-full cursor-pointer mx-2';

  const logout = () =>
  {
    set_logged_in(false);
    //remove the token cookies
    Cookies.remove('miracle_minutes_refresh_token');
    Cookies.remove('miracle_minutes_access_token');
  }

  return (
    <div className='sticky top-0 left-0 flex flex-row bg-purple-300 justify-between p-2 z-10'>
      <div className='flex items-center'>
        <img className='cursor-pointer' src='/img/hourglass_purple_transparent.png' alt='Logo' width='64' onClick={() => navigate('/')} />
        <Link className='text-2xl font-bold text-black ml-2' to='/'>Miracle Minutes</Link>
      </div>
      <div className='flex items-center'>
        {logged_in ? <Link className={signup_button_style_string} to='/dashboard'>Dashboard</Link> : <Link className={login_button_style_string} to='/login'>Log in</Link>}
        {logged_in ? null : <Link className={signup_button_style_string} to='/signup'>Sign up</Link>}
        {logged_in ? <Link className={signup_button_style_string} to='/' onClick={logout}>Logout</Link> : null}
      </div>
    </div>
  );
}