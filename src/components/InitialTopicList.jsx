import { useState } from "react";

export default function InitialTopicList({ title, topics, handle_change })
{
    const [checked_topics, set_checked_topics] = useState({});
    const local_handle_change = (topic) =>
    {
        set_checked_topics((prev) =>
        {
            const new_checked_topics = { ...prev };
            new_checked_topics[topic] = !new_checked_topics[topic];
            return new_checked_topics;
        })
        handle_change(topic);
    }

    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg'>

            <div className='flex flex-col grow p-8 gap-4'>
                <h2 className='text-2xl font-bold text-center'>{title}</h2>
            </div>

            {topics?.length === 0 && <p className='text-center'>None!</p>}

            <div className='flex flex-col p-8 gap-4'>
                {topics?.map((topic) =>
                {
                    return (
                        <div className='flex flex-row space-x-2' key={topic}>
                            <input className='accent-purple-600 w-4 h-4 border-black rounded mt-1 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0' type='checkbox' onChange={() => local_handle_change(topic)} />
                            <p className={'text-left transition-colors duration-500 ' + (checked_topics[topic] ? 'text-purple-700' : 'text-black')}>{topic}</p>
                        </div>);
                }
                )}
            </div>
        </div>
    );
}