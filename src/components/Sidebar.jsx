export default function Sidebar({components, setCurrentComponent})
{
    return (
        <div className="flex flex-col bg-pink-300">
            <div className="flex flex-col gap-y-2.5">
                {components.map((component) => <div className="button" onClick={() => setCurrentComponent(component)}>{component}</div>)}
            </div>
        </div>
    );
}