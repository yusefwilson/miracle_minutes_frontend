export default function Modal({ content, set_is_open })
{
    return (
        <div className='fixed left-0 right-0 top-[64px] bottom-0 bg-black bg-opacity-50 p-12'>
            <div className='flex flex-col justify-center w-full h-full bg-white bg-opacity-75 rounded-lg overflow-y-auto p-4 space-y-4'>
                <p className='text-center'>{content}</p>
                <button className='bg-purple-300 hover:bg-black font-bold border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer self-center px-2' onClick={() => set_is_open(false)}>Done reading</button>
            </div>
        </div>
    );
}