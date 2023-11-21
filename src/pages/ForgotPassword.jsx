import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword()
{
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) =>
    {
        //send forgot request to server
        axios.post('/forgot', {email});
        setSubmitted(true);
    };

    const handleChange = (event) =>
    {
        event.preventDefault();
        setEmail(event.target.value);
    };

    return (
            submitted ? <h1>Check your email for a reset code. You can use it <a href="/reset">here</a>.</h1>
            :
            <div className="bg-green-200 flex justify-center h-full grid content-center">
                <form noValidate onSubmit={handleSubmit} className="flex flex-col bg-pink-300">
                    <h1>Forgot your password? Enter your email to receive a reset code.</h1>
                    <input placeholder="Email" onChange={handleChange}></input>
                    <button type="submit">Send reset email</button>
                </form>
            </div>
    );
}