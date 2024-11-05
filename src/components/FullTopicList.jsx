export default function FullTopicList({ title, topics_info, read_only, handle_change })
{
    //handle lack of handle_change prop
    if (!handle_change)
    {
        handle_change = () => { };
    }

    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg w-full'>

            <div className='flex flex-col grow p-8 gap-4'>
                <h2 className='text-2xl font-bold text-center'>{title}</h2>
            </div>

            <div className='flex flex-col p-8 gap-4'>
                {Object.entries(topics_info)?.map(([topic, checked]) =>
                {
                    return (
                        <div className='flex flex-row space-x-2' key={topic}>
                            <input className='appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0' type='checkbox' checked={checked} readOnly={read_only} onChange={() => handle_change(topic)} />
                            <p className='text-left'>{topic}</p>
                        </div>);
                }
                )}
            </div>
        </div>
    );
}