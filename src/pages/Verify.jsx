import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';

export default function Verify() 
{
    // states/contexts/react utilities
    const [email, set_email] = useState('');
    const [code, set_code] = useState('');
    const [password, set_password] = useState('');
    const [error_message, set_error_message] = useState('');

    const { logged_in, set_logged_in } = useContext(LOGIN_CONTEXT);
    const { set_user } = useContext(USER_CONTEXT);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() =>
    {
        // if the user is already logged in, redirect them to the dashboard
        if (logged_in) { navigate('/dashboard'); }

        // try get email and password from location state. Should work if routed here from signup.
        const { email, password } = location.state || {};
        set_email(email);
        set_password(password);

    }, [location.search, logged_in, navigate]);

    const handle_change = (event) =>
    {
        switch (event.target.name)
        {
            case 'email':
                set_email(event.target.value);
                break;
            case 'code':
                set_code(event.target.value);
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
    
            const verify_result = await axios.post('/verify', { email, code, password });
            console.log('verify result: ', verify_result.data);
            const access_token = verify_result.data.access_token;
            const refresh_token = verify_result.data.refresh_token;

            // in this case, the password was accepted and the user was authenticated
            if (access_token && refresh_token)
            {
                set_error_message('');

                Cookies.set('miracle_minutes_access_token', access_token, { expires: 1, path: '/' });
                Cookies.set('miracle_minutes_refresh_token', refresh_token, { expires: 30, path: '/' });

                //update login and user context
                const user_response = await axios.post('/user', { access_token });
                set_user(user_response.data);
                set_logged_in(true);
                set_error_message('');

                navigate('/dashboard/shop');
            }

            // TODO: in this case, the password was not accepted and the user was not authenticated
            else
            {
                set_error_message(verify_result.data.error);
            }

        }

        catch (error)
        {
            console.log('in verify error with error: ', error);
            set_error_message(error.response.data.error);
        }

    }

    const handle_resend = async () =>
    {
        try
        {
            await axios.post('/resend', { email });
            set_error_message('');
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }
    }

    //styles
    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';
    const input_style_string = 'bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none';

    return (
        <div className='bg-slate-200 flex justify-center h-full grid content-center'>
            <div className='bg-gray-400 flex flex-col justify-center p-16 rounded-md shadow-lg border-2 border-black space-y-8'>
                <form className='flex flex-col grid content-center space-y-2' noValidate onSubmit={handle_submit}>
                    <h1 className='text-center'>Check your inbox and input your email and verification code!</h1>
                    <input className={input_style_string} type='email' placeholder='Email' name='email' onChange={handle_change} value={email} />
                    <input className={input_style_string} type='code' placeholder='Code' name='code' onChange={handle_change} />
                    <button className={button_style_string} type='submit'>Verify</button>
                    <button className='underline text-white' onClick={handle_resend}>Didn't get your code? Resend.</button>
                </form>
            </div>
            {error_message !== '' ? <p className='text-center text-red-300'>{error_message}</p> : null}
        </div>
    );
}