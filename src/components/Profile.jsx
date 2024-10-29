import { useContext, useState } from 'react';
import { LOGIN_CONTEXT } from '../App'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

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
        try
        {
            const access_token = Cookies.get('miracle_minutes_access_token');
            const portal_link_result = await axios.post('/portal', { access_token, domain: window.location.origin });
            window.location.href = portal_link_result.data.portal_url;
        }

        catch (error)
        {
            set_error_message('There has been an error. Please try again.');
        }
    }

    const plan_names = {
        0: 'None',
        1: 'Basic',
        2: 'Standard',
        3: 'Premium'
    };

    //styles

    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold p-2 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';

    return (
        Object.keys(user).length === 0 ?

            <Loading />

            :

            <div className='bg-slate-200 w-full justify-center grid content-center'>

                <div className='bg-gray-400 p-2 lg:p-16 border-2 border-black rounded shadow-lg space-y-8 flex flex-col h-full items-center'>
                    <h1 className='text-center text-2xl lg:text-5xl font-bold'>Profile</h1>
                    <p className='text-center bg-gray-300 rounded p-2 border-2 border-black w-full text-sm lg:text-base'>Email: {user.email}</p>

                    {
                        user.plan.plan_id !== 0 ?
                            <div className='flex flex-col items-center bg-gray-300 rounded p-2 border-2 border-black w-full'>
                                <p className='text-center bg-gray-300 rounded p-2'>Plan: {plan_names[user.plan.plan_id]}</p>
                                <button className={button_style_string} onClick={redirect_to_portal}>Upgrade/Cancel</button>
                            </div>

                            :
                            <p className='text-center bg-gray-300 rounded p-2 border-2 border-black w-full'>Plan: None. Visit
                                <button className={button_style_string} onClick={() => navigate('/dashboard/shop')}>Shop!</button>
                            </p>
                    }

                    <p className='text-center bg-gray-300 rounded p-2 border-2 border-black w-full'>Referral code: {user.referral_code}</p>
                    <button className='underline text-white text-center' onClick={logout_and_redirect_to_forgot}>Change password (will log you out)</button>
                </div>
                <p className='text-center text-red-300'>{error_message !== '' ? error_message : null}</p>

            </div>
    );
}