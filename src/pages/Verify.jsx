import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOGIN_CONTEXT } from '../App';

export default function Verify() //NEED TO NAVIGATE TO HERE FROM SIGNUP EMAIL
{
    const [email, set_email] = useState('');
    const [code, set_code] = useState('');
    const [error_message, set_error_message] = useState(''); //for displaying error messages
    const { logged_in } = useContext(LOGIN_CONTEXT); //get the login state and the function to set the login state from the context
    const navigate = useNavigate();
    const location = useLocation();
    const plan_to_buy_id = new URLSearchParams(location.search).get('p');

    useEffect(() =>
    {
        if (logged_in) { navigate('/dashboard'); }
        else
        {
            const e = new URLSearchParams(location.search).get('e');
            set_email(e);
        }
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

            await axios.post('/verify', { email, code });

            set_error_message('');
            navigate('/login?p=' + plan_to_buy_id);
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }

    }

    const handle_resend = async () =>
    {
        try
        {
            await axios.post('/reset', { email });
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