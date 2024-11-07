import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//local
import Sidebar from '../components/Sidebar';
import Articles from '../components/Articles';
import Profile from '../components/Profile';
import Shop from '../components/Shop';
import Topics from '../components/Topics';
import Loading from '../components/Loading';
import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';

export default function Dashboard()
{
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const { user } = useContext(USER_CONTEXT);

    const [components, set_components] = useState(['Profile', 'Articles', 'Topics']);
    const [current_component, set_current_component] = useState('');

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() =>
    {
        if (!logged_in) { navigate('/login'); return; }

        // only include the Shop component in the list if the user does not have a plan
        if (user?.plan?.plan_id !== 0 && components.includes('Shop'))
        {
            set_components(components.filter(component => component !== 'Shop'));
        }
        else if (user?.plan?.plan_id === 0 && !components.includes('Shop'))
        {
            set_components(components.concat('Shop'));
        }

        const new_current_component = params.component;
        if (new_current_component) { set_current_component(new_current_component); }

    }, [logged_in, navigate, params.component, user?.plan?.plan_id, components, user]);

    let rendered_component = <div />;

    switch (current_component.toLowerCase())
    {
        case 'articles':
            rendered_component = <Articles user={user} />;
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
        components !== null && components !== undefined ?

            <div className='bg-slate-200 flex flex-row h-full overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-400'>
                <Sidebar components={components} />
                {rendered_component}
            </div>

            :

            <Loading />
    );
}