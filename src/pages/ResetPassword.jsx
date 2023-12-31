import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { LOGIN_CONTEXT } from '../App';

export default function ResetPassword()
{
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const [code, set_code] = useState('');
    const [error_message, set_error_message] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {logged_in} = useContext(LOGIN_CONTEXT);

    useEffect( () =>
    {
        if(logged_in) {navigate('/dashboard');}
        const e = new URLSearchParams(location.search).get('e');
        set_email(e);
    }, [location.search, logged_in, navigate]);

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
            
            if(password !== confirm_password)
            {
                alert('Passwords do not match!');
                return;
            }

            //send reset request to server
            const reset_result = await axios.post('/reset', {password, email, code});
            console.log('reset result: ', reset_result);

            set_error_message('');
            navigate('/login');
        }

        catch (error)
        {
            console.log('reset error: ', error);
            set_error_message(error.response.data.error);
        }
    }

    return (
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handle_submit} className='flex flex-col bg-pink-300'>
                <h1>Enter your new password, and the code you received via email.</h1>
                <input placeholder='Email' onChange={handle_change} name='email' value={email}></input>
                <input placeholder='Code' onChange={handle_change} name='code'></input>
                <input placeholder='New password' onChange={handle_change} name='password'></input>
                <input placeholder='Confirm new password' onChange={handle_change} name='confirmPassword'></input>
                <button type='submit'>Reset password</button>
            </form>
            {error_message !== '' ? <h1>{error_message}</h1> : null}
        </div>
    );
}