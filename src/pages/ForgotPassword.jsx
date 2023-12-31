import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOGIN_CONTEXT } from '../App';

export default function ForgotPassword()
{
    const [email, set_email] = useState('');
    const [submitted, set_submitted] = useState(false);
    const navigate = useNavigate();
    const {logged_in} = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState('');

    useEffect(() => 
    {
        if(logged_in) { navigate('/dashboard'); }
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
        if(!is_valid_email(email)) {set_error_message('Invalid email address.'); return;}

        axios.post('/forgot', {email});
        set_submitted(true);
        set_error_message('');
    };

    const handle_change = (event) =>
    {
        set_email(event.target.value);
    };

    return (
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handle_submit} className='flex flex-col bg-pink-300'>
                <h1>Forgot your password? Enter your email to receive a reset code.</h1>
                <input placeholder='Email' onChange={handle_change}></input>
                <button type='submit'>Send reset email</button>
            </form>
            {submitted ? <h1>Check your email for a reset code. You can use it <a className='text-blue-500 underline hover:text-dark-blue-500' href={'/reset?e=' + email}>here</a>.</h1> : null}
            {error_message !== '' ? <h1>{error_message}</h1> : null}
        </div>
    );
}