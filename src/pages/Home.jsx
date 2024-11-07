import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';
import InitialTopicList from '../components/InitialTopicList';
import InitialPlanCard from '../components/InitialPlanCard';
import Loading from '../components/Loading';

export default function Home()
{
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const { user } = useContext(USER_CONTEXT);

    const [interested_topics, set_interested_topics] = useState([]);
    const [all_topics, set_all_topics] = useState([]);
    const [all_plans, set_all_plans] = useState([]);
    const [recommended_plan, set_current_plan] = useState(null);

    const navigate = useNavigate();

    const handle_submit = () =>
    {
        localStorage.setItem('interested_topics', JSON.stringify(interested_topics));
        localStorage.setItem('recommended_plan', JSON.stringify(recommended_plan));
        navigate('/signup');
    }

    const handle_change = (topic) =>
    {
        toggle_topic(topic);
        update_plan();
    }

    const toggle_topic = (topic) =>
    {
        if (interested_topics.includes(topic))
        {
            set_interested_topics(interested_topics.filter((current_topic) => current_topic !== topic));
        }

        else
        {
            set_interested_topics([...interested_topics, topic]);
        }
    }

    const update_plan = () =>
    {
        //figure out how many topics the user is interested in
        let num_interested_topics = interested_topics.length;
        //sort plans in order of max topics
        all_plans.sort((a, b) => a.maximum_topics - b.maximum_topics);
        console.log(all_plans);
        //figure out the plan with the minimum amount of max topics that is greater than or equal to the number of topics the user is interested in
        let new_plan = all_plans.find((plan) => plan.maximum_topics >= num_interested_topics);
        console.log('setting current plan to: ', new_plan);

        //catch undefined or null
        if (new_plan === undefined || new_plan === null)
        {
            return;
        }
        set_current_plan(new_plan);
    }

    useEffect(() =>
    {
        const get_all_topics = async () => 
        {
            try
            {
                //get all the possible topics from the backend
                const all_topics_response = await axios.get('/all_topics');
                let all_topics_data = all_topics_response.data.topics;
                set_all_topics(all_topics_data.sort());
            }

            catch (error)
            {
                console.log('error in Topics while trying to get all topics: ', error);
            }
        }

        const get_all_plans = async () =>
        {
            try
            {
                //get all the possible plans from the backend
                const all_plans_response = await axios.get('/all_plans');
                let all_plans_data = all_plans_response.data.plans;

                //remove free plan
                all_plans_data = all_plans_data.filter((plan) => plan.plan_id !== 0);
                all_plans_data.sort((a, b) => a.maximum_topics - b.maximum_topics);
                set_all_plans(all_plans_data);
                set_current_plan(all_plans_data[0]);
            }

            catch (error)
            {
                console.log('error in Plans while trying to get all plans: ', error);
            }
        }

        get_all_topics();
        get_all_plans();

    }, [logged_in, navigate]);

    useEffect(() =>
    {
        update_plan();
    }, [interested_topics]);

    //TODO: If not logged in, show free trial signup, if logged in AND free account, show upgrade button, if logged in AND premium account, show nothing

    return all_topics.length === 0 || all_plans.length === 0 ?

        <Loading />

        :

        (
            <div className='bg-slate-200 h-full space-y-8 overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-400'>
                <div className='flex flex-col items-center p-8 space-y-8'>
                    <h1 className='text-5xl text-center'>Save time, gain knowledge</h1>
                    <div className='flex flex-col sm:flex-row space-y-8 sm:space-y-0 space-x-8'>
                        {!logged_in && <InitialTopicList title='What topics are you interested in?' topics={all_topics} handle_change={handle_change} />}
                        {!logged_in && recommended_plan !== null && <InitialPlanCard name={recommended_plan.name} price={recommended_plan.price / 100} maximum_topics={recommended_plan.maximum_topics} features={[]} show_button={false} />}
                    </div>
                    {logged_in ? null : <button className='bg-black hover:bg-purple-700 text-white font-bold py-2 px-4 border-2 border-black rounded-full cursor-pointer mx-2' onClick={handle_submit}>Start your free trial now!</button>}
                    {logged_in && user.plan_id === 0 ? <Link className='bg-black hover:bg-purple-700 text-white font-bold py-2 px-4 border-2 border-black rounded-full cursor-pointer mx-2' to={'/signup?p=' + recommended_plan.plan_id}>Upgrade your account now!</Link> : null}
                </div>
            </div>
        );
}