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
    const navigate = useNavigate();

    useEffect( () => { console.log("in signup useeffect with loggedIn " + loggedIn); if(loggedIn) { navigate('/');} });

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
        event.preventDefault(); //prevent refresh

        if(password !== confirmPassword)
        {
            alert('Passwords do not match!');
            return;
        }
        //signup needs to be hooked up to backend
        let response = await axios.post('/signup', {email: email, password: password});
        console.log("SIGNUP RESPONSE: ", response);

        console.log('Submitted signup event with email: ' + email + ' and password: ' + password + ' and confirmPassword: ' + confirmPassword);
    }

    return (
        <div>
            <h1>Signup</h1>
            <form noValidate onSubmit={handleSubmit} className="signupForm">
                <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
                <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange}/>
                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}