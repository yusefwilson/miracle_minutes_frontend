import axios from "axios";
import { LoginContext } from "../App";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "../components/Sidebar";
import Articles from "../components/Articles";


export default function Dashboard()
{   
    const navigate = useNavigate();
    const {loggedIn} = useContext(LoginContext);
    const [user, setUser] = useState({});
    const components = ['Profile', 'Articles', 'Settings'];
    const [currentComponent, setCurrentComponent] = useState('Profile');

    useEffect( () =>
    {
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
                setUser(user_response.data);
            }        
        }   
        
        if(!loggedIn) { navigate('/login'); return; }
        get_user_data();
    }, [loggedIn, navigate]);

    let renderedComponent = <div></div>;

    switch(currentComponent)
    {
        case 'Profile':
            const purchase_string = user.purchases?.map( (purchase) => {return purchase.S}).join(", ");

            renderedComponent = (
            <div className="bg-yellow-300 flex flex-col">
                <h1 className="text-center">Profile</h1>
                <p>Email: {user.email}</p>
                <p>Purchases: {purchase_string}</p>
                <p>Referral code: {user.referral_code}</p>
            </div>);

            break;
        case 'Articles':
            renderedComponent = <Articles/>;
            break;
        case 'Settings':
            renderedComponent = <div>Settings</div>;
            break;
        default:
            break;
    }

    return (
        <div className="bg-green-200 flex flex-row h-full">
            <Sidebar components={components} setCurrentComponent={setCurrentComponent}/>
            {renderedComponent}
        </div>
    );
}