import { useContext, useState } from 'react';
import { LOGIN_CONTEXT } from '../App'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({user, set_current_component})
{
    const [error_message, set_error_message] = useState('');
    const {set_logged_in} = useContext(LOGIN_CONTEXT);
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
            const portal_link_result = await axios.post('/portal', { access_token });
            window.open(portal_link_result.data.portal_url, '_blank', 'noopener,noreferrer');
        }

        catch (error)
        {
            set_error_message('There has been an error. Please try again.');
        }
    }

    const purchase_string = user.purchases?.join(', ');

    return (
    Object.keys(user).length === 0 ?

    <p>Loading...</p> :

    <div className='bg-yellow-300 flex flex-col w-full grid content-start space-y-4 p-4'>
        <h1 className='text-center'>Profile</h1>
        <p className='text-center'>Email: {user.email}</p>

        {
            user.purchases?.length > 0 ?
            <p className='text-center'>Purchases: {purchase_string} 
                <button className='text-center underline text-blue-500 p-4' onClick={redirect_to_portal}>Manage</button>
            </p>
            :
            <p className='text-center'>Purchases: None. Visit 
                <button className='text-center underline text-blue-500 p-1' onClick={() => set_current_component('Shop')}>Shop!</button>
            </p>
        }
        
        <p className='text-center'>Referral code: {user.referral_code}</p>
        <button className='underline text-blue-500' onClick={logout_and_redirect_to_forgot}>Change password (will log you out)</button>
        <p className='text-center'>{error_message !== '' ? error_message : null}</p>
    </div>
    );
}