import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { LOGIN_CONTEXT } from '../App';
import ErrorBox from '../components/ErrorBox';

export default function ResetPassword()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const [code, set_code] = useState('');
    const [error_message, set_error_message] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { logged_in } = useContext(LOGIN_CONTEXT);

    useEffect(() =>
    {
        if (logged_in) { navigate('/dashboard'); }
        const e = new URLSearchParams(location.search).get('e');
        set_email(e);
    }, [location.search, logged_in, navigate]);

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
            case 'confirmPassword':
                set_confirm_password(event.target.value);
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
            event.preventDefault();

            if (password !== confirm_password)
            {
                alert('Passwords do not match!');
                return;
            }

            //send reset request to server
            await axios.post('/reset', { password, email, code });

            set_error_message('');
            navigate('/login');
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }
    }

    return (
        <div className='bg-white flex justify-center h-full items-center'>

            <div className='flex flex-col bg-gray-400 p-16 rounded-md border-2 border-black space-y-8'>
                <h1 className='text-3xl text-center font-bold'>Reset Password</h1>
                <form className='flex flex-col space-y-4' noValidate onSubmit={handle_submit}>
                    <h1>Enter your new password, and the code you received via email.</h1>
                    <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' placeholder='Email' onChange={handle_change} name='email' value={email}></input>
                    <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' placeholder='Code' onChange={handle_change} name='code'></input>
                    <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' placeholder='New password' onChange={handle_change} name='password'></input>
                    <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none' placeholder='Confirm new password' onChange={handle_change} name='confirmPassword'></input>
                    <button className='bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2' type='submit'>Reset password</button>
                </form>
                {error_message !== '' ? <ErrorBox error={error_message} /> : null}
            </div>
        </div>
    );
}