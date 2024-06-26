import { useContext, useState } from 'react';
import { LOGIN_CONTEXT } from '../App'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({ user })
{
    const [error_message, set_error_message] = useState('');
    const { set_logged_in } = useContext(LOGIN_CONTEXT);
    const navigate = useNavigate();

    const logout_and_redirect_to_forgot = () =>
    {
        set_logged_in(false);
        //remove the token cookies
        Cookies.remove('miracle_minutes_refresh_token');
        Cookies.remove('miracle_minutes_access_token');
        navigate('/forgot');
    }

    const redirect_to_portal = async () =>
    {
        try {
            const access_token = Cookies.get('miracle_minutes_access_token');
            const portal_link_result = await axios.post('/portal', { access_token });
            window.open(portal_link_result.data.portal_url, '_blank', 'noopener,noreferrer');
        }

        catch (error) {
            set_error_message('There has been an error. Please try again.');
        }
    }

    const purchase_string = user.purchases?.join(', ');

    return (
        Object.keys(user).length === 0 ?

            <div className='h-full w-full flex justify-center grid content-center'>
                <img src='/gif/breathing_hourglass.gif' alt='Loading...' width='300'></img>
            </div>

            :

            <div className='bg-slate-200 w-full justify-center grid content-center'>

                <div className='bg-gray-400 p-16 border-2 border-black rounded shadow-lg space-y-8 flex flex-col'>
                    <h1 className='text-center text-5xl'>Profile</h1>
                    <p className='text-center bg-gray-300 rounded p-2 border-2 border-black'>Email: {user.email}</p>

                    {
                        user.purchases?.length > 0 ?
                            <div className='flex flex-row bg-gray-300 rounded'>
                                <p className='text-center bg-gray-300 rounded p-2'>Purchases: {purchase_string}</p>
                                <button className='text-center bg-purple-400 rounded-md p-1 border-2 border-gray-300 hover:bg-white' onClick={redirect_to_portal}>Manage</button>
                            </div>

                            :
                            <p className='text-center bg-gray-300 rounded p-2 border-2 border-black'>Purchases: None. Visit
                                <button className='text-center underline text-purple-600 p-1' onClick={() => navigate('/dashboard/shop')}>Shop!</button>
                            </p>
                    }

                    <p className='text-center bg-gray-300 rounded p-2 border-2 border-black'>Referral code: {user.referral_code}</p>
                    <button className='underline text-white text-center' onClick={logout_and_redirect_to_forgot}>Change password (will log you out)</button>
                </div>
                <p className='text-center text-red-300'>{error_message !== '' ? error_message : null}</p>

            </div>
    );
}