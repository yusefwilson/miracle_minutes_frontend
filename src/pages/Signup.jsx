import { useState, useContext, useEffect } from 'react';
import { LOGIN_CONTEXT } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const {logged_in} = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState(''); //for displaying error messages
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

            if(password !== confirm_password)
            {
                alert('Passwords do not match!');
                return;
            }

            await axios.post('/signup', {email: email, password: password});

            set_error_message('');
            navigate('/verify?e=' + email);
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
                    <h1 className='text-center text-5xl p-4'>Sign up</h1>
                    <input className='bg-gray-300 rounded h-8 p-4' type='email' placeholder='Email' name='email' onChange={handle_change}/>
                    <input className='bg-gray-300 rounded h-8 p-4' type='password' placeholder='Password' name='password' onChange={handle_change}/>
                    <input className='bg-gray-300 rounded h-8 p-4' type='password' placeholder='Confirm Password' name='confirmPassword' onChange={handle_change}/>
                    <button className='bg-purple-400 rounded hover:bg-white h-8'type='submit'>Sign up</button>
                </form>
                <h1 className='text-center'><a className='underline text-white' href='/login'>Already have an account? Log in!</a></h1>
            </div>
            {error_message !== '' ? <p className='text-center text-red-300'>{error_message}</p> : null}
        </div>
    );
}