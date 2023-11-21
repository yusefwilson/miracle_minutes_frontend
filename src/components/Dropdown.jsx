import { useState } from 'react';

export default function Dropdown({title, content})
{
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => { setIsOpen(!isOpen); }

    return (
        <div className='flex flex-col bg-pink-300'>
            <div className='button' onClick={toggleDropdown}> {title} </div>
            {isOpen && <p>{content}</p>}
        </div>
    );
}