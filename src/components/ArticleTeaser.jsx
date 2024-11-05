import Dropdown from './Dropdown';

export default function ArticleTeaser({ title, content })
{
    return (
        <div className='bg-gray-400 rounded p-4 space-y-8 flex flex-col w-full md:w-1/4 justify-center border-2 border-black mx-4 my-4'>
            <h1 className='text-center text-2xl lg:text-2xl font-bold'>{title}</h1>
            <div className='w-48 overflow-hidden whitespace-nowrap text-ellipsis'>
                {content}
            </div>
            <Dropdown title='Read More' content={content} />
        </div>
    );
}