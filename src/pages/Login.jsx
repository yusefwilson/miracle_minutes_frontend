import { useContext, useState } from 'react';
import { LoginContext } from '../App';

export default function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {loggedIn, setLoggedIn} = useContext(LoginContext);

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

        console.log('Submitted event with email: ' + email + ' and password: ' + password);
    }

    return (
        <div className="Login">
            <h1>Login</h1>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
                <input type="email" placeholder="Email" name="email" onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}