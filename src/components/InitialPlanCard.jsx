export default function InitialPlanCard({ name, price, maximum_topics, show_button = true })
{
    return (
        <div className='bg-gray-400 flex flex-col border-2 border-black rounded-lg'>
            <div className='flex flex-col grow p-8 gap-4'>
                <h1 className='text-3xl font-bold'>Recommended Plan:</h1>
                <h2 className='text-2xl font-bold'>{name}</h2>
                <h3 className='text-xl font-bold'>${price + '/month'}</h3>
                <p className='text-lg'>{`Access to daily summaries of up to ${maximum_topics} topics!`}</p>
            </div>
        </div>
    );
}