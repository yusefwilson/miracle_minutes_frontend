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

            let response = await axios.post('/signup', {email: email, password: password});
            console.log('signup response: ', response);

            set_error_message('');
            navigate('/verify?e=' + email);
        }

        catch(error)
        {
            set_error_message(error.response.data.error);
        }
    }

    return (
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handle_submit} className='bg-pink-300 flex flex-col'>
                <h1 className='text-center'>Signup</h1>
                <input type='email' placeholder='Email' name='email' onChange={handle_change}/>
                <input type='password' placeholder='Password' name='password' onChange={handle_change}/>
                <input type='password' placeholder='Confirm Password' name='confirmPassword' onChange={handle_change}/>
                <button type='submit'>Sign up</button>
            </form>
            {error_message !== '' ? <p>{error_message}</p> : null}
        </div>
    );
}