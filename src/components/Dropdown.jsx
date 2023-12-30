import { useState } from 'react';

export default function Dropdown({title, content})
{
    const [is_open, set_is_open] = useState(false);

    const toggle_dropdown = () => { set_is_open(!is_open); }

    return (
        <div className='flex flex-col bg-blue-300'>
            <div className='button underline cursor-pointer' onClick={toggle_dropdown}> {title} </div>
            {is_open && <p>{content}</p>}
        </div>
    );
}