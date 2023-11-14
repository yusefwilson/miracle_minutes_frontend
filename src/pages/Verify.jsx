import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Verify() //NEED TO NAVIGATE TO HERE FROM SIGNUP EMAIL
{
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); //for displaying error messages
    const navigate = useNavigate();

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
        //console.log("VERIFY RESPONSE: ", response);

        if(response.data.hasOwnProperty("error"))
        {
            switch(response.data.error.name)
            {
                case "InvalidParameterException":
                    setErrorMessage("Please enter a valid email and code.");
                    break;
                case "ExpiredCodeException":
                    setErrorMessage("Code has expired or is incorrect! Please request a new code or try again.");
                    break;
                default:
                    setErrorMessage("An unknown error has occurred. Please try again.");
                    break;
            }   
            
        }
        else
        {
            setErrorMessage('');
            navigate('/login');
        }

        //console.log('Submitted verify event with email: ' + email + ' and code: ' + code);
    }

    return (
        <div className='bg-green-800 flex justify-center h-full'>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col w-1/4 grid content-center bg-pink-800">
                <h1 className='text-center'>Check your inbox and input your email and verification code!</h1>
                <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                <input type="code" placeholder="Code" name="code" onChange={handleChange}/>
                <button type="submit">Verify</button>
            </form>
            {/* <button onClick={handleResend}>Resend</button> */}
            {errorMessage !== '' ? <p>{errorMessage}</p> : null}
        </div>
    )
}