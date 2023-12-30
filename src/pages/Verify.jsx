import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../App';

export default function Verify() //NEED TO NAVIGATE TO HERE FROM SIGNUP EMAIL
{
    const [email, set_email] = useState('');
    const [code, set_code] = useState('');
    const [error_message, set_error_message] = useState(''); //for displaying error messages
    const {logged_in} = useContext(LoginContext); //get the login state and the function to set the login state from the context
    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () =>
    {
        if(logged_in) { navigate('/dashboard'); }
        else
        {
            const e = new URLSearchParams(location.search).get('e');
            set_email(e);
        }
    }, [location.search, logged_in, navigate]);

    const handle_change = (event) =>
    {
        switch(event.target.name)
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

            let response = await axios.post('/verify', {email: email, code: code});
            console.log('verify response: ', response);

            set_error_message('');
            navigate('/login');
        }

        catch (error)
        {
            console.log('verify error: ', error);
            set_error_message(error.response.data.error);
        }
        
    }

    return (
        <div className='bg-green-200 flex justify-center h-full'>
            <form noValidate onSubmit={handle_submit} className='flex flex-col w-1/4 grid content-center bg-pink-300'>
                <h1 className='text-center'>Check your inbox and input your email and verification code!</h1>
                <input type='email' placeholder='Email' name='email' onChange={handle_change} value={email}/>
                <input type='code' placeholder='Code' name='code' onChange={handle_change}/>
                <button type='submit'>Verify</button>
            </form>
            {/* <button onClick={handleResend}>Resend</button> */}
            {error_message !== '' ? <p>{error_message}</p> : null}
        </div>
    );
}