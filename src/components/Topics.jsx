import { useContext, useState, useEffect } from 'react';
import { LOGIN_CONTEXT } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import TopicList from './TopicList';
import Loading from './Loading';

export default function Topics({ user })
{
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const navigate = useNavigate();

    // state
    const [current_topics] = useState([]);
    const [new_topics, set_new_topics] = useState([]);
    const [resultant_topics, set_resultant_topics] = useState(current_topics);

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

                //filter out topics that are already in the user's plan
                const user_topics = user?.plan?.topics;
                const new_topics = all_topics_data.filter((topic) => !user_topics.includes(topic));

                set_new_topics(new_topics);
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
            const response = await axios.post('/update_plan', { topics: resultant_topics });
            console.log('response from update_plan: ', response);
        }

        catch (error)
        {
            console.log('error in Topics while trying to update plan: ', error);
        }
    }

    return (
        new_topics?.length === 0 ?

            <Loading />

            :

            <div className='bg-slate-200 flex flex-row w-full justify-center items-center space-x-4'>
                <TopicList title='Current Topics' topic_list={current_topics} handle_select_topic={toggle_resultant_topics} checkable={true} />
                <TopicList title='New Topics' topic_list={new_topics} handle_select_topic={toggle_resultant_topics} checkable={true}/>
                <TopicList title='Result' topic_list={resultant_topics} />
            </div>
    );
}