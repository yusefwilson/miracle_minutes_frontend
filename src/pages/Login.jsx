import { useContext, useState, useEffect } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {loggedIn, setLoggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState('');
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
            default:
                break;
        }
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault(); //prevent refresh

        //log in - needs to be hooked up to backend
        let response = await axios.post('/login', {email: email, password: password});
        console.log("LOGIN RESPONSE: ", response);

        if(response.data.hasOwnProperty("error"))
        {
            setErrorMessage(response.data.error);
        }

        else
        {
            Cookies.set('miracle_minutes_refresh_token', response.data.refresh_token, {expires: 30, path: ''});
            Cookies.set('miracle_minutes_access_token', response.data.access_token, {expires: 1, path: ''});
            setLoggedIn(true);
            setErrorMessage('');
            navigate('/dashboard');
        }

        console.log('Submitted login event with email: ' + email + ' and password: ' + password);
    }

    return (
        <div className="bg-green-200 flex justify-center h-full grid content-center">
            <form noValidate onSubmit={handleSubmit} className="flex flex-col bg-pink-300">
                <h1 className='text-center'>Login</h1>
                <input type="email" placeholder="Email" name="email" onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                <button type="submit">Log in</button>
            </form>
            {errorMessage !== '' ? <p>{errorMessage}</p> : null}
        </div>
    );
}