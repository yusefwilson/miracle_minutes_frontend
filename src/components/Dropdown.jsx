import { useState } from 'react';
import Modal from './Modal';

export default function Dropdown({ key, title, content })
{
    const [is_open, set_is_open] = useState(false);

    const toggle_dropdown = () => { set_is_open(!is_open); }
    const button_style_string = 'bg-purple-300 hover:bg-black font-bold border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer self-center px-2';
    return (
        <div key={key} className='flex flex-col'>
            <div className={button_style_string} onClick={toggle_dropdown}> {title} </div>
            {is_open && <Modal content={content} set_is_open={set_is_open} />}
        </div>
    );
}