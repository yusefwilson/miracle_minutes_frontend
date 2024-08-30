export default function ErrorBox({ error })
{
    return (
        <div className='bg-red-200 flex flex-col border-2 border-black rounded-lg p-4'>
            <h2 className='text-center font-bold'>Oops! Something went wrong:</h2>
            <p className='text-center'>{error}</p>
        </div>
    );
}