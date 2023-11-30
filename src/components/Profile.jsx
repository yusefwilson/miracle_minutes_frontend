import { useContext } from 'react';
import { LoginContext } from '../App'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Profile({user})
{

    const {setLoggedIn} = useContext(LoginContext);
    const navigate = useNavigate();

    const logout_and_redirect_to_forgot = () =>
    {
        setLoggedIn(false);
        //remove the token cookies
        Cookies.remove('miracle_minutes_refresh_token');
        Cookies.remove('miracle_minutes_access_token');
        navigate('/forgot');
    }

    const purchase_string = user.purchases?.map( (purchase) => {return purchase.S}).join(', ');

    return (
    Object.keys(user).length === 0 ? 
        <p>Loading...</p> :
    <div className='bg-yellow-300 flex flex-col w-full grid content-start'>
        <h1 className='text-center'>Profile</h1>
        <p className='text-center'>Email: {user.email}</p>
        <p className='text-center'>Purchases: {purchase_string}</p>
        <p className='text-center'>Referral code: {user.referral_code}</p>
        <button className='underline text-blue-500' onClick={logout_and_redirect_to_forgot}>Change password (will log you out)</button>
    </div>
    );
}