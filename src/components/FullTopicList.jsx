export default function FullTopicList({ title, checked_topics, unchecked_topics })
{
    const input_style_string = 'appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0';

    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg w-full'>

            <div className='flex flex-col grow p-8 gap-4'>
                <h2 className='text-2xl font-bold text-center'>{title}</h2>
            </div>

            {checked_topics?.length === 0 && unchecked_topics?.length === 0 && <p className='text-center'>None!</p>}

            <div className='flex flex-col p-8 gap-4'>
                {checked_topics?.map((topic) =>
                {
                    return (
                        <div className='flex flex-row space-x-2' key={topic}>
                            <input className={input_style_string} type='checkbox' checked readOnly />
                            <p className='text-left'>{topic}</p>
                        </div>);
                }
                )}
                {unchecked_topics?.map((topic) =>
                {
                    return (
                        <div className='flex flex-row space-x-2' key={topic}>
                            <input className={input_style_string} type='checkbox' checked={false} readOnly />
                            <p className='text-left'>{topic}</p>
                        </div>);
                }
                )}
            </div>
        </div>
    );
}