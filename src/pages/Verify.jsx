import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Verify() //NEED TO NAVIGATE TO HERE FROM SIGNUP EMAIL
{
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
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
        console.log("VERIFY RESPONSE: ", response);

        navigate('/login');

        console.log('Submitted verify event with email: ' + email + ' and code: ' + code);
    }

    return (
        <div>
            <h1>Verify</h1>
            <form noValidate onSubmit={handleSubmit} className="signupForm">
                <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                <input type="code" placeholder="Code" name="code" onChange={handleChange}/>
                <button type="submit">Verify</button>
            </form>
        </div>
    )
}