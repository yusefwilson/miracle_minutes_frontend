export default function PasswordRequirements({ error, width })
{
    return (
        <div className={'bg-red-200 flex flex-col border-2 border-black rounded-lg p-4 ' + width}>
            <h2 className='text-center font-bold'>Oops! Something went wrong:</h2>
            <p className='text-center'>{error}</p>
        </div>
    );
}