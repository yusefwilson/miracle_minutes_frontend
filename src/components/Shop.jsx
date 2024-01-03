import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Shop({ user })
{
    const [error_message, set_error_message] = useState('');
    const [all_products, set_all_products] = useState([]); // [ {name: 'product1', price: 1}, {name: 'product2', price: 2} ] (price is per month in cents)
    const [current_products, set_current_products] = useState([]);
    const [desired_products, set_desired_products] = useState([]);

    useEffect(() =>
    {
        const get_all_products = async () =>
        {
            try
            {
                const all_products_response = await axios.get('/all_products');
                set_all_products(all_products_response.data.products);
            }

            catch (error)
            {
                set_error_message('There has been an error. Please try again.');
            }
        }

        get_all_products();
        set_current_products(user.purchases);
    }, [user.purchases]);

    const redirect_to_checkout = async () =>
    {
        try
        {
            const access_token = Cookies.get('miracle_minutes_access_token');
            const checkout_url_result = await axios.post('/checkout', { access_token, desired_products });
            window.location.href = checkout_url_result.data.checkout_url;
        }

        catch (error)
        {
            set_error_message('There has been an error. Please try again.');
        }
    }

    const on_toggle = (event) =>
    {
        const product_name = event.target.name;
        const product_checked = event.target.checked;

        if(product_checked)
        {
            let new_desired_products = desired_products;
            new_desired_products.push(product_name);
            set_desired_products(new_desired_products);
        }

        else
        {
            const new_desired_products = desired_products.filter( (product) => product !== product_name);
            set_desired_products(new_desired_products);
        }
    }

    if(Object.keys(user).length === 0) { return <p>Loading...</p>; }

    // take the user's purchases, subtract them from the current products, and only display the remaining products as checkboxes
    return (

        all_products.length === 0 ?
        
        <div className='h-full w-full flex justify-center grid content-center'>
            <img src='/gifs/rotating_hourglass.gif' alt='Loading...' width='300'></img>
        </div>
        
        :
        <div className='bg-white w-full justify-center grid content-center'>


            <div className='bg-gray-400 flex flex-col justify-center space-y-4 rounded p-16'>
                <h1 className='text-center text-5xl'>Shop</h1>
                {all_products?.map( (product) =>
                {
                    // if the user has already purchased the product, make the checkbox uncheckable
                    let purchased = current_products.includes(product.name);
                    return (
                        <div key={product.name} className='flex flex-row space-x-4 justify-between bg-gray-200 rounded p-2'>

                            <p className='text-center'>{product.name + (purchased ? ' (purchased)' : '')}</p>

                            <div className='flex flex-row space-x-2'>
                                <p className='text-center'>{'$' + (product.price / 100).toString()}</p>
                                <input disabled={purchased} className='appearance-none w-4 h-4 border-2 border-purple-200 rounded-full mt-1 bg-white checked:bg-purple-500
                                checked:border-0 disabled:border-gray-400 disabled:bg-gray-400'
                                name={product.name} type='checkbox' onChange={on_toggle} />
                            </div>

                        </div>
                    );
                })}
                <button className='bg-purple-400 rounded p-2 hover:bg-white shadow-lg' onClick={redirect_to_checkout}>Checkout</button>
                
            </div>
            <p className='text-center text-red-300'>{error_message !== '' ? error_message : null}</p>
        </div>
    );
}