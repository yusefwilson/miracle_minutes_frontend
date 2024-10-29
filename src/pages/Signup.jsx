import { useState, useContext, useEffect } from 'react';
import { LOGIN_CONTEXT } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState(''); //for displaying error messages
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
            case 'confirmPassword':
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
            event.preventDefault(); //prevent refresh

            if (password !== confirm_password)
            {
                alert('Passwords do not match!');
                return;
            }

            await axios.post('/signup', { email, password });

            set_error_message('');
            navigate('/verify', { state: { email, password } });
        }

        catch (error)
        {
            set_error_message(error.response.data.error);
        }
    }

    //styles
    const login_button_style_string = 'bg-purple-300 hover:bg-black text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';
    const input_field_style = 'bg-gray-300 rounded h-12 p-4 border-gray-600 border-2 focus:outline-none';

    return (
        <div className='bg-slate-200 flex justify-center items-center h-full'>
            <form className='bg-gray-400 flex flex-col justify-center p-16 rounded-md shadow-lg border-2 border-black h-4/5 w-2/3 xl:w-1/3 space-y-8' noValidate onSubmit={handle_submit}>
                <h1 className='text-center text-5xl p-4'>Sign up</h1>
                <h1>Already have an account? <a className='underline text-white' href='/login'>Log in!</a></h1>
                <input className={input_field_style} type='email' placeholder='Email' name='email' onChange={handle_change} />
                <input className={input_field_style} type='password' placeholder='Password' name='password' onChange={handle_change} />
                <input className={input_field_style} type='password' placeholder='Confirm Password' name='confirmPassword' onChange={handle_change} />
                <button className={login_button_style_string} type='submit'>Sign up</button>
                {error_message !== '' ? <p className='text-center text-red-300'>{error_message}</p> : null}
            </form>
        </div>
    );
}