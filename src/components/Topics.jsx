import { useContext, useState, useEffect } from 'react';
import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import TopicList from './TopicList';
import Loading from './Loading';
import ErrorBox from './ErrorBox';

export default function Topics()
{
    console.log('in topics');
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const { user } = useContext(USER_CONTEXT);
    const navigate = useNavigate();

    // state
    const [current_topics] = useState(user?.plan?.topics);
    const [new_topics, set_new_topics] = useState([]);
    const [resultant_topics, set_resultant_topics] = useState(current_topics);
    const [error, set_error] = useState('');

    useEffect(() =>
    {
        // redirect to login if not logged in
        if (!logged_in) { navigate('/login'); return; }

        const get_all_topics = async () => 
        {
            try
            {
                //get all the possible topics from the backend
                const all_topics_response = await axios.get('/all_topics');
                let all_topics_data = all_topics_response.data.topics;

                console.log('all topics: ', all_topics_data);

                //filter out topics that are already in the user's plan
                const user_topics = user?.plan?.topics;
                console.log('user: ', user);
                console.log('user topics: ', user_topics);
                const new_topics = all_topics_data.filter((topic) => !user_topics.includes(topic));
                console.log('new topics: ', new_topics);


                set_new_topics(new_topics);
                //set_current_topics(user_topics);
            }

            catch (error)
            {
                console.log('error in Topics while trying to get all topics: ', error);
            }
        }

        get_all_topics();

    }, [logged_in, navigate, user?.plan?.topics]);

    // toggle handler, passed to TopicLists
    const toggle_resultant_topics = (topic) =>
    {
        // toggle the existence of the toggled topic in the resultant topics array
        if (resultant_topics.includes(topic))
        {
            set_resultant_topics(resultant_topics.filter((current_topic) => current_topic !== topic));
        }

        else
        {
            set_resultant_topics([...resultant_topics, topic]);
        }
    }

    // send the resultant topics to the backend
    const handle_submit = async () =>
    {
        try
        {
            const access_token = Cookies.get('miracle_minutes_access_token');
            const topics_to_add = resultant_topics.filter((topic) => !user.plan.topics.includes(topic));
            const topics_to_remove = user.plan.topics.filter((topic) => !resultant_topics.includes(topic));
            await axios.post('/change_topics', { topics_to_add, topics_to_remove, access_token });
            set_error('');
        }

        catch (error)
        {
            console.log('error in Topics while trying to update plan: ', error);
            set_error(error.response.data.error);
        }
    }

    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2 w-1/4';

    return (
        new_topics !== null && new_topics !== undefined && current_topics !== null && current_topics !== undefined ?

            <div className='bg-slate-200 flex flex-col w-full h-full p-8 items-center space-y-4'>
                <div className='bg-slate-200 flex flex-row w-full h-full justify-center items-center space-x-4'>
                    <TopicList title='Current Topics' topic_list={current_topics} handle_select_topic={toggle_resultant_topics} checkable={true} default_checked={true} />
                    <TopicList title='New Topics' topic_list={new_topics} handle_select_topic={toggle_resultant_topics} checkable={true} />
                    <TopicList title='Result' topic_list={resultant_topics} />
                </div>
                {error && <ErrorBox error={error} />}
                <button className={button_style_string} onClick={handle_submit}>Submit</button>
            </div>

            :

            <Loading />
    );
}