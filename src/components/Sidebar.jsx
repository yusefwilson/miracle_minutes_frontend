import { useNavigate } from 'react-router-dom';

export default function Sidebar({ components })
{
    const navigate = useNavigate();

    //styles
    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';

    return (
        <div className='bg-gray-500 flex flex-col p-2 pt-12'>
            <div className='flex flex-col space-y-8'>
                {components.map((component) =>
                    <button key={component} className={button_style_string}
                        onClick={() => navigate('/dashboard/' + component.toLowerCase())}>{component}</button>)}
            </div>
        </div>
    );
}