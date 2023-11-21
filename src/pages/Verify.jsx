import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../App';

export default function Verify() //NEED TO NAVIGATE TO HERE FROM SIGNUP EMAIL
{
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); //for displaying error messages
    const {loggedIn} = useContext(LoginContext); //get the login state and the function to set the login state from the context
    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () =>
    {
        if(loggedIn) { navigate('/dashboard'); }
        else
        {
            const e = new URLSearchParams(location.search).get('e');
            setEmail(e);
        }
    }, [location.search, loggedIn, navigate]);

    const handleChange = (event) =>
    {
        switch(event.target.name)
        {
            case 'email':
                setEmail(event.target.value);
                break;
            case 'code':
                setCode(event.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault(); //prevent refresh

        let response = await axios.post('/verify', {email: email, code: code});

        if(response.data.hasOwnProperty("error"))
        {
            setErrorMessage(response.data.error);   
        }
        else
        {
            setErrorMessage('');
            navigate('/login');
        }
    }

    return (
        <div className='bg-green-200 flex justify-center h-full'>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col w-1/4 grid content-center bg-pink-300">
                <h1 className='text-center'>Check your inbox and input your email and verification code!</h1>
                <input type="email" placeholder="Email" name="email" onChange={handleChange} value={email}/>
                <input type="code" placeholder="Code" name="code" onChange={handleChange}/>
                <button type="submit">Verify</button>
            </form>
            {/* <button onClick={handleResend}>Resend</button> */}
            {errorMessage !== '' ? <p>{errorMessage}</p> : null}
        </div>
    )
}