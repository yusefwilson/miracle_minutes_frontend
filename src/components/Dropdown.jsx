import { useState } from 'react';

export default function Dropdown({title, content})
{
    const [is_open, set_is_open] = useState(false);

    const toggle_dropdown = () => { set_is_open(!is_open); }

    return (
        <div className='flex flex-col bg-purple-300 rounded-md'>
            <div className='button underline cursor-pointer text-center' onClick={toggle_dropdown}> {title} </div>
            {is_open && <p className='text-center'>{content}</p>}
        </div>
    );
}