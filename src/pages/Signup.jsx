import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { LOGIN_CONTEXT } from '../App';
import ErrorBox from '../components/ErrorBox';
import Verify from '../components/Verify';
import PasswordRequirements from '../components/PasswordRequirements';

export default function Signup()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const [error_message, set_error_message] = useState('');
    const [verify, set_verify] = useState(false);
    const [show_password, set_show_password] = useState(false);

    const { logged_in } = useContext(LOGIN_CONTEXT);

    const navigate = useNavigate();

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
            case 'confirm_password':
                set_confirm_password(event.target.value);
                break;
            default:
                break;
        }
    }

    const handle_submit = async (event) =>
    {
        try
        {
            //prevent refresh
            event.preventDefault();
            if (password !== confirm_password)
            {
                //temporary error handling
                // eslint-disable-next-line
                throw { response: { data: { error: 'Passwords do not match.' } } };
            }

            await axios.post('/signup', { email, password });

            set_error_message('');
            set_verify(true);
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }
    }

    const toggle_show_password = () => { set_show_password(!show_password); }

    return (
        <div className='bg-slate-200 flex justify-center items-center h-full'>
            {
                verify ?

                    <Verify email={email} password={password} />

                    :

                    <form className='bg-gray-400 flex flex-col justify-center p-16 rounded-md shadow-lg border-2 border-black w-2/3 xl:w-1/3 space-y-8' noValidate onSubmit={handle_submit}>
                        <h1 className='text-center text-5xl p-4'>Sign up</h1>
                        <h1>Already have an account? <a className='underline text-white' href='/login'>Log in!</a></h1>
                        <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none w-full max-w-full' type='email' placeholder='Email' name='email' onChange={handle_change}></input>

                        <div className='relative flex flex-row justify-between'>
                            <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none w-full max-w-full flex-grow pr-10 overflow-hidden' type={show_password ? 'text' : 'password'} placeholder='Password' name='password' onChange={handle_change} />
                            <button className='absolute right-2 top-1/2 transform -translate-y-1/2 w-auto h-auto pr-2' type='button' onClick={toggle_show_password}>
                                <img className='h-6 w-6' alt='Show' src={show_password ? '/img/show.png' : '/img/hide.png'} />
                            </button>
                        </div>

                        <input className='bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none w-full max-w-full' type={show_password ? 'text' : 'password'} placeholder='Confirm Password' name='confirm_password' onChange={handle_change} />

                        <h2>Password requirements:</h2>

                        <PasswordRequirements password={password} />

                        <button className='bg-purple-300 hover:bg-black text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2' s type='submit'>Sign up</button>
                        {error_message !== '' ? <ErrorBox error={error_message} /> : null}
                    </form>
            }
        </div>
    );
}