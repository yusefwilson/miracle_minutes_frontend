import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword({email})
{
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) =>
    {
        switch(event.target.name)
        {
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
        const reset_result = await axios.post('/reset', {password, email: 'yusefwilsonx@gmail.com', code})

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
        errorMessage === '' ?
        <div className="bg-green-200 flex justify-center h-full grid content-center">
            <form noValidate onSubmit={handleSubmit} className="flex flex-col bg-pink-300">
                <h1>Enter your new password, and the code you received via email.</h1>
                <input placeholder="Code" onChange={handleChange} name="code"></input>
                <input placeholder="New password" onChange={handleChange} name="password"></input>
                <input placeholder="Confirm new password" onChange={handleChange} name="confirmPassword"></input>
                <button type="submit">Reset password</button>
            </form>
        </div>
        :
        <div>
            <h1>{errorMessage}</h1>
        </div>
    );
}