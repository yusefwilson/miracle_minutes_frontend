import { useState } from 'react';

import Modal from './Modal';

export default function Dropdown({ key, title, content, video_ids })
{
    const [is_open, set_is_open] = useState(false);

    const toggle_dropdown = () => { set_is_open(!is_open); }

    return (
        <div className='flex flex-col' key={key} >
            <div className='bg-purple-300 hover:bg-black font-bold text-center border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer px-2' onClick={toggle_dropdown}>
                {title}
            </div>
            {is_open && <Modal content={content} set_is_open={set_is_open} video_ids={video_ids} />}
        </div>
    );
}