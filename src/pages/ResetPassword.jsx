import { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

export default function ResetPassword()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () =>
    {
        const e = new URLSearchParams(location.search).get('e');
        setEmail(e);
    }, [location.search]);

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
            case 'code':
                setCode(event.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        if(password !== confirmPassword)
        {
            alert('Passwords do not match!');
            return;
        }
        //send reset request to server
        const reset_result = await axios.post('/reset', {password, email, code})

        if(reset_result.data.hasOwnProperty("error"))
        {
            setErrorMessage(reset_result.data.error);
        }
        else
        {
            setErrorMessage('');
            navigate('/login');
        }
    }

    return (
        <div className="bg-green-200 flex justify-center h-full grid content-center">
            <form noValidate onSubmit={handleSubmit} className="flex flex-col bg-pink-300">
                <h1>Enter your new password, and the code you received via email.</h1>
                <input placeholder="Email" onChange={handleChange} name="email" value={email}></input>
                <input placeholder="Code" onChange={handleChange} name="code"></input>
                <input placeholder="New password" onChange={handleChange} name="password"></input>
                <input placeholder="Confirm new password" onChange={handleChange} name="confirmPassword"></input>
                <button type="submit">Reset password</button>
            </form>
            {errorMessage !== '' ? <h1>{errorMessage}</h1> : null}
        </div>
    );
}