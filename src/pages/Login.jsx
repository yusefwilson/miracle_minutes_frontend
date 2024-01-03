import { useContext, useState, useEffect } from 'react';
import { LOGIN_CONTEXT } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const {logged_in, set_logged_in} = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState('');
    const navigate = useNavigate();

    useEffect( () => { if(logged_in) { navigate('/dashboard'); } });

    const handle_change = (event) =>
    {
        switch(event.target.name)
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
            let response = await axios.post('/login', {email: email, password: password});

            Cookies.set('miracle_minutes_refresh_token', response.data.refresh_token, {expires: 30, path: '/'});
            Cookies.set('miracle_minutes_access_token', response.data.access_token, {expires: 1, path: '/'});
            set_logged_in(true);
            set_error_message('');
            navigate('/dashboard');
        }

        catch(error)
        {
            set_error_message(error.response.data.error);
        }
    }

    return (
        <div className='bg-white flex justify-center h-full grid content-center'>
            <div className='flex flex-col bg-gray-400 p-16 rounded-md shadow-lg'>
                <form className='flex flex-col space-y-2' noValidate onSubmit={handle_submit}>
                    <h1 className='text-center text-5xl p-4'>Log in</h1>
                    <input className='bg-gray-300 rounded h-8 p-4 focus:outline-none' type='email' placeholder='Email' name='email' onChange={handle_change} />
                    <input className='bg-gray-300 rounded h-8 p-4 focus:outline-none' type='password' placeholder='Password' name='password' onChange={handle_change} />
                    <button className='bg-purple-400 rounded hover:bg-white h-8 shadow-lg' type='submit'>Log in</button>
                </form>
                <h1 className='text-center'> <a className='underline text-white' href='/forgot'>Forgot your password?</a> </h1>
            </div>
            {error_message !== '' ? <p className='text-center text-red-300'>{error_message}</p> : null}
        </div>
    );
}