export default function Modal({ content, set_is_open, video_ids })
{
    return (
        <div className='fixed left-0 right-0 top-[64px] bottom-0 bg-black bg-opacity-50 p-12 overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-400'>
            <div className='flex flex-col justify-center w-full h-full bg-white bg-opacity-75 rounded-lg overflow-y-auto p-4 space-y-4 scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-400'>
                <div className='p-4 space-y-4 overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-400 h-full flex flex-col'>
                    <h1 className='text-center text-2xl font-bold'>Today's Article:</h1>
                    <p className='text-center'>{content}</p>

                    {video_ids.length !== 0 && <h1 className='text-center text-2xl font-bold'>Related Videos:</h1>}

                    {video_ids.length !== 0 && <div className='flex justify-center flex-col mx-2 sm:flex-row items-center bg-transparent'>

                        {video_ids.map((id) => (
                            <div key={id} className='w-96 h-48 overflow-auto shadow-lg flex flex-col sm:flex-row p-4'>
                                <iframe className='rounded-lg border-0'
                                    width='100%'
                                    height='100%'
                                    src={`https://www.youtube.com/embed/${id}`}
                                    title='YouTube video player'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                />
                            </div>
                        ))}
                    </div>}

                    <button className='bg-purple-300 hover:bg-black font-bold border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer self-center px-2' onClick={() => set_is_open(false)}>Done reading</button>
                </div>
            </div>
        </div>
    );
}