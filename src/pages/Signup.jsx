import { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {loggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState(''); //for displaying error messages
    const navigate = useNavigate();

    useEffect( () => { if(loggedIn) { navigate('/dashboard');} });

    const handleChange = (event) =>
    {
        switch(event.target.name)
        {
            case 'email':
                setEmail(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(event.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) =>
    {
        try
        {
            event.preventDefault(); //prevent refresh

            if(password !== confirmPassword)
            {
                alert('Passwords do not match!');
                return;
            }
            
            let response = await axios.post('/signup', {email: email, password: password});

            if(response.data.hasOwnProperty('error'))
            {
                setErrorMessage(response.data.error);
            }
            else
            {
                setErrorMessage('');
                navigate('/verify?e=' + email);
            }
        }

        catch(error)
        {
            setErrorMessage(error.response.data.error);
        }
    }

    return (
        <div className='bg-green-200 flex justify-center h-full grid content-center'>
            <form noValidate onSubmit={handleSubmit} className='bg-pink-300 flex flex-col'>
                <h1 className='text-center'>Signup</h1>
                <input type='email' placeholder='Email' name='email' onChange={handleChange}/>
                <input type='password' placeholder='Password' name='password' onChange={handleChange}/>
                <input type='password' placeholder='Confirm Password' name='confirmPassword' onChange={handleChange}/>
                <button type='submit'>Sign up</button>
            </form>
            {errorMessage !== '' ? <p>{errorMessage}</p> : null}
        </div>
    );
}