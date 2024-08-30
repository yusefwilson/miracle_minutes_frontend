import { useContext, useState, useEffect } from 'react';
import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const { logged_in, set_logged_in } = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState('');
    const navigate = useNavigate();
    const { set_user } = useContext(USER_CONTEXT);

    useEffect(() => { if (logged_in) { navigate('/dashboard'); } });

    const handle_change = (event) =>
    {
        switch (event.target.name)
        {
            case 'email':
                set_email(event.target.value);
                break;
            case 'password':
                set_password(event.target.value);
                break;
            default:
                break;
        }
    }

    const handle_submit = async (event) =>
    {
        try
        {
            event.preventDefault(); //prevent refresh

            //log in - needs to be hooked up to backend
            let response = await axios.post('/login', { email: email, password: password });

            Cookies.set('miracle_minutes_refresh_token', response.data.refresh_token, { expires: 30, path: '/' });
            Cookies.set('miracle_minutes_access_token', response.data.access_token, { expires: 1, path: '/' });

            let user_response = await axios.post('/user', { access_token: response.data.access_token });
            
            // important to set user here because the only other place it is set is when refreshing tokens
            set_user(user_response.data);
            set_logged_in(true);
            set_error_message('');

            navigate('/dashboard');
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }
    }

    //styles
    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';

    return (
        <div className='bg-slate-200 flex justify-center items-center h-full'>
            <form className='flex flex-col justify-center bg-gray-400 p-16 rounded-md shadow-lg border-2 border-black h-4/5 w-2/3 xl:w-1/3 space-y-8' noValidate onSubmit={handle_submit}>
                <h1 className='text-center text-5xl p-4'>Log in</h1>
                <h2>Need an account? <a className='text-white underline' href='/signup'>Create one!</a></h2>
                <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' type='email' placeholder='Email' name='email' onChange={handle_change} />
                <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' type='password' placeholder='Password' name='password' onChange={handle_change} />
                <button className={button_style_string} type='submit'>Log in</button>
                <h1 className='text-center'> <a className='underline text-white' href='/forgot'>Forgot your password?</a> </h1>
                {error_message !== '' ? <p className='text-center text-red-300'>{error_message}</p> : null}
            </form>
        </div>
    );
}