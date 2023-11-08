import { useContext, useState } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {loggedIn, setLoggedIn} = useContext(LoginContext);
    const navigate = useNavigate();

    if(loggedIn) { navigate('/'); }

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

    const handleSubmit = (event) =>
    {
        event.preventDefault(); //prevent refresh

        //log in - needs to be hooked up to backend
        setLoggedIn(true);

        console.log('Submitted login event with email: ' + email + ' and password: ' + password);
    }

    return (
        <div className="Login">
            <h1>Login</h1>
            <form noValidate onSubmit={handleSubmit} className="loginForm">
                <input type="email" placeholder="Email" name="email" onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}