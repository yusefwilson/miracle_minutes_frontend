export default function InitialTopicList({ title, topics, handle_change })
{
    const input_style_string = 'appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0';

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
                            <input className={input_style_string} type='checkbox' onChange={() => handle_change(topic)} />
                            <p className='text-left'>{topic}</p>
                        </div>);
                }
                )}
            </div>
        </div>
    );
}