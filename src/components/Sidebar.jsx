export default function Sidebar({components, set_current_component})
{
    return (
        <div className='flex flex-col bg-pink-300'>
            <div className='flex flex-col gap-y-2.5'>
                {components.map((component) => <div key={component} className='underline cursor-pointer' onClick={() => set_current_component(component)}>{component}</div>)}
            </div>
        </div>
    );
}