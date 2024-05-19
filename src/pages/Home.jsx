import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LOGIN_CONTEXT, USER_CONTEXT } from '../App';

export default function Home()
{
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const { user } = useContext(USER_CONTEXT);
    const signup_button_style_string = 'bg-black hover:bg-purple-700 text-white font-bold py-2 px-4 border-2 border-black rounded-full cursor-pointer mx-2';

    console.log('Home page. User logged in: ' + logged_in);

    //TODO: If not logged in, show free trial signup, if logged in AND free account, show upgrade button, if logged in AND premium account, show nothing

    return (
        <div className='bg-white h-full p-8 space-y-8'>
            <div className='flex flex-col grid justify-items-center p-8 space-y-8'>
                <h1 className='text-5xl text-center'>Save time, gain knowledge</h1>
                <p className='text-center w-1/2'>Are you sick of spending hours watching poorly-edited, long-winded YouTube videos to find out information? Well worry no more, because with Miracle Minutes' AI-powered summarizing, you can receive concise, accurate summaries of important information that only take a few minutes to read!</p>
                {logged_in ? null : <Link className={signup_button_style_string} to='/plans'>Start your free trial now!</Link>}
                {logged_in && user.plan_id === 0 ? <Link className={signup_button_style_string} to='/plans'>Upgrade your account now!</Link> : null}
            </div>
        </div>
    );
}