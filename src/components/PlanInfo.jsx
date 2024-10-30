export default function PlanInfo({ name, max_topics, used_topics, topics_left_to_use })
{
    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg px-16 py-4'>
            <h2 className='text-2xl font-bold text-center'>Current Plan Info:</h2>
            <p className='text-center'>Name: {name}</p>
            <p className='text-center'>Max Topics: {max_topics}</p>
            <p className='text-center'>Used Topics: {used_topics}</p>
            <p className='text-center'>Topics Left to Use: {topics_left_to_use}</p>
        </div>
    );
}