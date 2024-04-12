import { Link } from "react-router-dom";

export default function Home()
{
    const signup_button_style_string = 'bg-black hover:bg-purple-700 text-white font-bold py-2 px-4 border-2 border-black rounded-full cursor-pointer mx-2';

    return (
        <div className='bg-white h-full p-8 space-y-8'>
            <div className='flex flex-col grid justify-items-center p-8 space-y-8'>
                <h1 className='text-5xl text-center'>Save time, gain knowledge</h1>
                <p className='text-center w-1/2'>Are you sick of spending hours watching poorly-edited, long-winded YouTube videos to find out information? Well worry no more, because with Miracle Minutes' AI-powered summarizing, you can receive concise, accurate summaries of important information that only take a few minutes to read!</p>
                <Link className={signup_button_style_string} to='/dashboard'>Start your free trial now!</Link>
            </div>
        </div>
    );
}