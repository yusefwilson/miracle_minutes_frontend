import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../App';

export default function ForgotPassword()
{
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const {loggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => 
    {
        if(loggedIn) { navigate('/dashboard'); }
    }, [loggedIn, navigate]);

    const isValidEmail = (email) =>
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSubmit = (event) =>
    {
        event.preventDefault();
        //send forgot request to server
        if(!isValidEmail(email)) {setErrorMessage('Invalid email address.'); return;}

        axios.post('/forgot', {email});
        setSubmitted(true);
        setErrorMessage('');
    };

    const handleChange = (event) =>
    {
        setEmail(event.target.value);
    };

    return (
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handleSubmit} className='flex flex-col bg-pink-300'>
                <h1>Forgot your password? Enter your email to receive a reset code.</h1>
                <input placeholder='Email' onChange={handleChange}></input>
                <button type='submit'>Send reset email</button>
            </form>
            {submitted ? <h1>Check your email for a reset code. You can use it <a href={'/reset?e=' + email}>here</a>.</h1> : null}
            {errorMessage !== '' ? <h1>{errorMessage}</h1> : null}
        </div>
    );
}