export default function Sidebar({components, set_current_component})
{
    return (
        <div className='flex flex-col bg-gray-300 p-4'>
            <div className='flex flex-col space-y-8'>
                {components.map((component) => 
                <div key={component} className='cursor-pointer hover:bg-purple-300 p-4 text-center rounded'
                 onClick={() => set_current_component(component)}>{component}</div>)}
            </div>
        </div>
    );
}