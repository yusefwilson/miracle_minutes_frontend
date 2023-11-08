import { LoginContext } from "../App";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard()
{   
    const navigate = useNavigate();
    const {loggedIn} = useContext(LoginContext);

    useEffect( () => { if(!loggedIn) { navigate('/login');} });

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}