import { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';

export default function PasswordRequirements({ password })
{
    const [requirements, set_requirements] = useState([
        { id: 1, text: 'At least 8 characters', satisfied: false },
        { id: 2, text: 'Contains an uppercase letter', satisfied: false },
        { id: 3, text: 'Contains a number', satisfied: false },
        { id: 4, text: 'Contains a special character (!@#$%^&*)', satisfied: false }
    ]);

    const check_requirements = () =>
    {
        console.log('new password: ', password);
        set_requirements((prevRequirements) =>
            prevRequirements.map((requirement) =>
            {
                switch (requirement.id)
                {
                    case 1:
                        return { ...requirement, satisfied: password.length >= 8 };
                    case 2:
                        return { ...requirement, satisfied: /[A-Z]/.test(password) };
                    case 3:
                        return { ...requirement, satisfied: /[0-9]/.test(password) };
                    case 4:
                        return { ...requirement, satisfied: /[!@#$%^&*]/.test(password) };
                    default:
                        return requirement;
                }
            })
        );

        console.log('requirements: ', requirements);
    };

    useEffect(() => check_requirements(), [password]);

    return (
        <div>
            {requirements.map((requirement) => (
                <div key={requirement.id} className="flex items-center space-x-2">
                    {requirement.satisfied ? (
                        <CheckIcon className="w-5 h-5 text-purple-600 transition-colors duration-500" />
                    ) : (
                        <XMarkIcon className="w-5 h-5 text-red-500 transition-colors duration-500" />
                    )}
                    <p className={'transition-colors duration-500 ' + (requirement.satisfied ? 'text-purple-700' : 'text-gray-700')}>
                        {requirement.text}
                    </p>
                </div>
            ))}
        </div>
    );
}