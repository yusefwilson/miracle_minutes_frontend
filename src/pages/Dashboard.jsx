import axios from "axios";
import { LoginContext } from "../App";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Dashboard()
{   
    const navigate = useNavigate();
    const {loggedIn} = useContext(LoginContext);
    const [user, setUser] = useState({});

    const get_user_data = async () => 
    {
        const access_token = Cookies.get('miracle_minutes_access_token');
        const user_response = await axios.post('/user', {access_token});
        
        if(user_response.data.hasOwnProperty('error'))
        {
            Cookies.remove('miracle_minutes_access_token');
            Cookies.remove('miracle_minutes_refresh_token');
            navigate('/login');
        }

        else
        {
            console.log("User data: ", user_response.data);
            setUser(user_response.data);
        }        
    }

    useEffect( () =>
    {
        if(!loggedIn) { navigate('/login'); return; }
        console.log("Dashboard page loaded");
        get_user_data();
        console.log("User: ", user);
    }, []);

    return (
        <div className="bg-green-800 flex flex-col grid content-center justify-center h-full">
            <h1>Dashboard</h1>
            <p>Email: {user.email}</p>
            <p>Purchases: {user.purchases}</p>
            <p>Referral code: {user.referral_code}</p>
        </div>
    );
}