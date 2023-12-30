import axios from 'axios';
import { LoginContext } from '../App';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Sidebar from '../components/Sidebar';
import Articles from '../components/Articles';
import Profile from '../components/Profile';
import Shop from '../components/Shop';

//import { print_object_array, print_array, print_object } from '../helpers.js';

export default function Dashboard()
{   
    const navigate = useNavigate();
    const {loggedIn} = useContext(LoginContext);
    const [user, setUser] = useState({});
    const components = ['Profile', 'Articles', 'Shop', 'Settings'];
    const [currentComponent, setCurrentComponent] = useState('Profile');

    useEffect( () =>
    {
        const get_user_data = async () => 
        {
            try
            {
                const access_token = Cookies.get('miracle_minutes_access_token');
                const user_response = await axios.post('/user', {access_token});
                let user_data = user_response.data;
                user_data.purchases = user_data.purchases.map( (purchase) => {return purchase.S});
                setUser(user_data);
            }
            
            catch (error)
            {
                Cookies.remove('miracle_minutes_access_token');
                Cookies.remove('miracle_minutes_refresh_token');
                navigate('/login');
            }
        }   
        
        if(!loggedIn) { navigate('/login'); return; }
        get_user_data();
        
    }, [loggedIn, navigate]);

    let renderedComponent = <div/>;

    switch(currentComponent)
    {
        case 'Profile':
            renderedComponent = <Profile user={user}/>;
            break;
        case 'Articles':
            renderedComponent = <Articles/>;
            break;
        case 'Settings':
            renderedComponent = <div>Settings</div>;
            break;
        case 'Shop':
            renderedComponent = <Shop user={user}/>;
            break;
        default:
            break;
    }

    return (
        <div className='bg-green-200 flex flex-row h-full'>
            <Sidebar components={components} setCurrentComponent={setCurrentComponent}/>
            {renderedComponent}
        </div>
    );
}