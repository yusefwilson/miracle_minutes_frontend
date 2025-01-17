import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { LOGIN_CONTEXT } from '../App';
import ErrorBox from '../components/ErrorBox';

export default function ForgotPassword()
{
    const [email, set_email] = useState('');
    const [submitted, set_submitted] = useState(false);
    const navigate = useNavigate();
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState('');

    useEffect(() => 
    {
        if (logged_in) { navigate('/dashboard'); }
    }, [logged_in, navigate]);

    const is_valid_email = (email) =>
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handle_submit = (event) =>
    {
        event.preventDefault();
        //send forgot request to server
        if (!is_valid_email(email)) { set_error_message('Invalid email address.'); return; }

        axios.post('/forgot', { email });
        set_submitted(true);
        set_error_message('');
    };

    const handle_change = (event) =>
    {
        set_email(event.target.value);
    };

    return (
        <div className='bg-slate-200 flex flex-col justify-center items-center h-full space-y-8'>
            <form className='flex flex-col justify-center bg-gray-400 p-16 rounded-md shadow-lg border-2 border-black h-1/2 w-2/3 xl:w-1/3 space-y-8' noValidate onSubmit={handle_submit}>
                <h1>Forgot your password? Enter your email to receive a reset code.</h1>
                <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' placeholder='Email' onChange={handle_change}></input>
                <button className='bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2' type='submit'>Send code</button>
                {error_message !== '' ? <ErrorBox error={error_message} /> : null}
                {submitted ?
                    <h1 className='text-center'>A reset code has been sent to that email. You can use it <span></span>
                        <a className='text-center text-purple-500 underline hover:text-black' href={'/reset?e=' + email}>here</a>.
                    </h1> : null}
            </form>
        </div>
    );
}