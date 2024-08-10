import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from './Loading';

export default function Shop({ user })
{
    const [error_message, set_error_message] = useState('');
    const [all_plans, set_all_plans] = useState([]); // [ {name: 'product1', price: 1}, {name: 'product2', price: 2} ] (price is per month in cents)
    const [selected_plan_id, set_selected_plan_id] = useState(0);

    useEffect(() =>
    {
        const get_all_products = async () =>
        {
            try
            {
                const all_plans_response = await axios.get('/all_plans');
                console.log("ALL PLANS RESPONSE: ", all_plans_response);
                set_all_plans(all_plans_response.data.plans);
                console.log("ALL PLANS: ", all_plans_response.data.plans);
            }

            catch (error)
            {
                set_error_message('There has been an error. Please try again.');
            }
        }

        get_all_products();
    }, [user.purchases]);

    const redirect_to_checkout = async () =>
    {
        try
        {
            const access_token = Cookies.get('miracle_minutes_access_token');
            const checkout_url_result = await axios.post('/checkout', { access_token, desired_plan_id: selected_plan_id });
            window.location.href = checkout_url_result.data.checkout_url;
        }

        catch (error)
        {
            set_error_message('There has been an error. Please try again.');
        }
    }

    const on_toggle = (event) =>
    {
        const plan_checked = event.target.checked;
        const plan_id = parseInt(event.target.id);
        console.log("PLAN ID: ", plan_id)

        //trigger refresh of checkboxes by changing the selected_plan state
        set_selected_plan_id(plan_checked ? plan_id : 0);

        console.log("SELECTED PLAN: ", selected_plan_id)
    }

    if (Object.keys(user).length === 0) { return <Loading />; }

    //styles
    const button_style_string = 'bg-purple-300 hover:bg-black text-center text-black font-bold py-2 px-4 border-2 border-black hover:border-transparent hover:text-white rounded-full cursor-pointer mx-2';
    const input_style_string = 'appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500 checked:border-0 disabled:border-gray-400 disabled:bg-gray-400';

    // take the user's purchases, subtract them from the current products, and only display the remaining products as checkboxes
    return (

        all_plans?.length === 0 ?

            <Loading />

            :

            <div className='bg-slate-200 w-full justify-center grid content-center'>

                <div className='bg-gray-400 flex flex-col justify-center space-y-4 rounded p-2 lg:p-16 border-2 border-black'>
                    <h1 className='text-center text-2xl lg:text-5xl'>Shop</h1>
                    {all_plans?.map((plan) =>
                    {
                        // if the user has already purchased the product, make the checkbox uncheckable
                        let purchased = user.plan.plan_id === plan.id;
                        return (
                            <div key={plan.name} className='flex flex-row space-x-4 justify-between bg-gray-200 rounded p-2 border-2 border-black'>

                                <p className='text-center'>{plan.name + (purchased ? ' (purchased)' : '')}</p>

                                <div className='flex flex-row space-x-2'>
                                    <p className='text-center'>{'$' + (plan.price / 100).toString()}</p>
                                    <input disabled={purchased} className={input_style_string} name={plan.name} id={plan.id} type='checkbox' onChange={on_toggle} checked={plan.id === selected_plan_id} />
                                </div>

                            </div>
                        );
                    })}
                    <button className={button_style_string} onClick={redirect_to_checkout}>Checkout</button>

                </div>
                <p className='text-center text-red-300'>{error_message !== '' ? error_message : null}</p>
            </div>
    );
}