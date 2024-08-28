import axios from 'axios';
import { LOGIN_CONTEXT } from '../App';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import Sidebar from '../components/Sidebar';
import Articles from '../components/Articles';
import Profile from '../components/Profile';
import Shop from '../components/Shop';
import Topics from '../components/Topics';

export default function Dashboard()
{
    const navigate = useNavigate();
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const [user, set_user] = useState({});
    const components = ['Profile', 'Articles', 'Shop', 'Topics'];
    const [current_component, set_current_component] = useState('');
    const params = useParams();

    useEffect(() =>
    {
        const get_user_data = async () => 
        {
            try {
                const access_token = Cookies.get('miracle_minutes_access_token');
                console.log('posting in dashboard with access token: ', access_token)
                const user_response = await axios.post('/user', { access_token });
                console.log('user_response: ', user_response.data);
                let user_data = user_response.data;
                set_user(user_data);
            }

            catch (error) {
                Cookies.remove('miracle_minutes_access_token');
                Cookies.remove('miracle_minutes_refresh_token');
                navigate('/login');
            }
        }

        if (!logged_in) { navigate('/login'); return; }

        const new_current_component = params.component;
        console.log('params.component: ', params.component)
        console.log('new_current_component: ', new_current_component);
        if (new_current_component) { set_current_component(new_current_component); }

        get_user_data();

    }, [logged_in, navigate, params.component]);

    let rendered_component = <div />;

    switch (current_component.toLowerCase()) {
        case 'articles':
            rendered_component = <Articles />;
            break;
        case 'shop':
            rendered_component = <Shop user={user} />;
            break;
        case 'topics':
            rendered_component = <Topics user={user} />;
            break;
        default:
            rendered_component = <Profile user={user} />;
            break;
    }

    return (
        <div className='bg-slate-200 flex flex-row h-full'>
            <Sidebar components={components} />
            {rendered_component}
        </div>
    );
}