import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

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
            const new_desired_products = desired_products.filter( (product) => product.name !== product_name);
            set_desired_products(new_desired_products);
        }
    }

    if(Object.keys(user).length === 0) { return <p>Loading...</p>; }

    // take the user's purchases, subtract them from the current products, and only display the remaining products as checkboxes
    return (

        all_products.length === 0 ?
        
        <p>Loading...</p>
        
        :
        <div className='bg-yellow-300 w-full flex flex-row justify-center'>
            <div className='bg-red-300 flex flex-col justify-center space-y-4'>
                <h1 className='text-center'>Shop</h1>
                {all_products?.map( (product) =>
                {
                    // if the user has already purchased the product, make the checkbox uncheckable
                    let purchased = current_products.includes(product.name);
                    return (
                        <div key={product.name} className='flex flex-row space-x-4 justify-center bg-green-200'>
                            <p className='text-center'>{product.name + (purchased ? ' (purchased)' : '')}</p>
                            <p className='text-center'>{'$' + (product.price / 100).toString()}</p>
                            <input name={product.name} type='checkbox' onChange={on_toggle} disabled={purchased}/>
                        </div>
                    );
                })}
                <button className='underline text-blue-500 bg-pink-200 rounded' onClick={redirect_to_checkout}>Checkout</button>
                <p className='text-center'>{error_message !== '' ? error_message : null}</p>
            </div>
        </div>
    );
}