import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';
import Loading from './Loading';
import ErrorBox from './ErrorBox';
import FullTopicList from './FullTopicList';
import PlanInfo from './PlanInfo';

export default function Topics()
{
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const { user, set_user } = useContext(USER_CONTEXT);
    const navigate = useNavigate();

    // state
    const [current_topics_info, set_current_topics_info] = useState({});
    const [desired_topics_info, set_desired_topics_info] = useState({});
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState('');

    useEffect(() =>
    {
        // redirect to login if not logged in
        if (!logged_in) { navigate('/login'); return; }

        const set_up_state = async () => 
        {
            try
            {
                //get all the possible topics from the backend
                const all_topics_response = await axios.get('/all_topics');
                let all_topics_data = all_topics_response.data.topics;
                all_topics_data.sort();

                //create dictionaries of all topics, with all values set to false
                let current_topics_info = {};
                let desired_topics_info = {};

                for (let topic of all_topics_data)
                {
                    current_topics_info[topic] = false;
                    desired_topics_info[topic] = false;
                }

                //establish the info about the user's current topics. this info does not change until a submit
                const user_topics = user?.plan?.topics;
                for (let topic of user_topics)
                {
                    current_topics_info[topic] = true;
                }

                set_current_topics_info(current_topics_info);

                //establish info about user's desired topics. this info changes as the user toggles topics
                //special case: navigated from stripe, so we have the interested topics in local storage
                if (localStorage.getItem('interested_topics'))
                {
                    const interested_topics = JSON.parse(localStorage.getItem('interested_topics'));

                    for (let topic of interested_topics)
                    {
                        desired_topics_info[topic] = true;
                    }
                }

                //otherwise, the desired topics are the same as the current topics
                else
                {
                    desired_topics_info = current_topics_info;
                }

                set_desired_topics_info(desired_topics_info);
            }

            catch (error)
            {
                console.log('error in Topics while trying to get all topics: ', error);
            }
        }

        set_up_state();

    }, [logged_in, navigate, user?.plan?.topics]);

    // toggle handler, passed to TopicLists
    const toggle_desired_topic = (topic) =>
    {
        let new_desired_topics_info = { ...desired_topics_info };
        new_desired_topics_info[topic] = !new_desired_topics_info[topic];
        set_desired_topics_info(new_desired_topics_info);
    }

    // send the resultant topics to the backend
    const handle_submit = async () =>
    {
        try
        {
            // request to change topics
            const access_token = Cookies.get('miracle_minutes_access_token');
            const resultant_topics = Object.keys(desired_topics_info).filter((topic) => desired_topics_info[topic]);
            const topics_to_add = resultant_topics.filter((topic) => !user.plan.topics.includes(topic));
            const topics_to_remove = user.plan.topics.filter((topic) => !resultant_topics.includes(topic));
            set_loading(true);
            await axios.post('/change_topics', { topics_to_add, topics_to_remove, access_token });

            //now that we have changed the topics, we can refresh the user
            const user_response = await axios.post('/user', { access_token });
            set_user(user_response.data);

            // if we are here, there are no errors!
            set_error('');

            //we can now remove the interested topics from local storage
            localStorage.removeItem('interested_topics');

            set_loading(false);

            navigate('/dashboard/articles');
        }

        catch (error)
        {
            console.log('error in Topics while trying to update plan: ', error);
            set_error(error.response.data.error);
            set_loading(false);
        }
    }

    return (

        desired_topics_info && current_topics_info && user && !loading ?

            <div className='bg-slate-200 flex flex-col justify-center items-center p-8 overflow-y-auto space-y-4 w-full lg:pt-0'>
                <div className='p-4 space-y-4 overflow-y-auto h-full flex flex-col items-center'>
                    {
                        user?.plan?.plan_id === 0 ?
                            <h1 className='text-center text-2xl lg:text-2xl font-bold'>Please purchase a plan to access this feature</h1>
                            :
                            <PlanInfo
                                name={user.plan.name}
                                max_topics={user.plan.maximum_topics}
                                used_topics={user.plan.topics.length}
                                topics_left_to_use={user.plan.maximum_topics - user.plan.topics.length} />
                    }

                    <div className='flex flex-col gap-4 lg:flex-row '>
                        <FullTopicList title='Current' topics_info={current_topics_info} read_only={true} />
                        <FullTopicList title='Desired' topics_info={desired_topics_info} read_only={false} handle_change={toggle_desired_topic} />
                    </div>
                    {error && <ErrorBox error={error} width='w-1/3' />}
                    <button className='bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2 lg:w-1/4' onClick={handle_submit}>Submit</button>
                </div>
            </div>

            :

            <Loading />
    );
}