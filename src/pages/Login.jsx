import { useContext, useState, useEffect } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const {logged_in, set_logged_in} = useContext(LoginContext);
    const [error_message, set_error_message] = useState('');
    const navigate = useNavigate();

    useEffect( () => { if(logged_in) { navigate('/dashboard');} });

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

            console.log('response: ', response.data);

            Cookies.set('miracle_minutes_refresh_token', response.data.refresh_token, {expires: 30, path: ''});
            Cookies.set('miracle_minutes_access_token', response.data.access_token, {expires: 1, path: ''});
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
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handle_submit} className='flex flex-col bg-pink-300'>
                <h1 className='text-center'>Login</h1>
                <input type='email' placeholder='Email' name='email' onChange={handle_change} />
                <input type='password' placeholder='Password' name='password' onChange={handle_change} />
                <button type='submit'>Log in</button>
            </form>
            <h1 className='text-center'><a className='underline text-blue-500' href='/forgot'>Forgot your password?</a></h1>
            {error_message !== '' ? <p>{error_message}</p> : null}
        </div>
    );
}