import { Link } from 'react-router-dom';

export default function PlanCard({ name, price, description, features, id })
{

    const button_style_string = 'bg-purple-300 text-center hover:bg-black text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';

    const on_free_trial = () =>
    {
        console.log('Free trial started for plan: ', id);
    }

    return (
        <div className='flex flex-col border-4 w-1/5 h-3/5 rounded-lg'>
            <div className='flex flex-col grow p-8 gap-4'>
                <h2 className='text-2xl font-bold'>{name}</h2>
                <h3 className='text-xl font-bold'>${price + '/month'}</h3>
                <p className='text-lg'>{description}</p>
            </div>
            <div className='flex flex-col p-8 gap-4'>
                <ul>
                    {features.map((feature, index) => <li key={index}>{'- ' + feature}</li>)}
                </ul>
                <Link className={button_style_string} to='/signup' onClick={on_free_trial}>Start Free Trial!</Link>
            </div>
        </div>
    );
}