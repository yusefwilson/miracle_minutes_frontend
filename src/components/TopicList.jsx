export default function TopicList({ title, topic_list, handle_select_topic, checkable, default_checked = (topic) => false })
{

    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg w-full'>

            <div className='flex flex-col grow p-8 gap-4'>
                <h2 className='text-2xl font-bold text-center'>{title}</h2>
            </div>

            {topic_list?.length === 0 && <p className='text-center'>None!</p>}

            <div className='flex flex-col p-8 gap-4'>
                {topic_list?.map((topic) =>
                {
                    return checkable ?

                        (<div className='flex flex-row space-x-2' key={topic}>
                            <input className='appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0' type='checkbox' onChange={() => handle_select_topic(topic)}
                                defaultChecked={default_checked(topic)} />
                            <p className='text-left'>{topic}</p>
                        </div>)

                        :

                        (<div className='flex flex-row space-x-2' key={topic}>
                            <input className='appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400 flex flex-shrink-0' type='checkbox' checked readOnly />
                            <p className='text-left'>{topic}</p>
                        </div>)
                }
                )}
            </div>
        </div>
    );
}