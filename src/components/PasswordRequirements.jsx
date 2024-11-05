import { useEffect, useState } from 'react';

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
    };

    useEffect(() => check_requirements(), [password]);

    return (
        <ul>
            {requirements.map((requirement) => (
                <li className={'font-bold ' + (requirement.satisfied ? 'text-green-300' : 'text-red-600')} key={requirement.id}>
                    {requirement.text}
                </li>
            ))}
        </ul>
    );
}