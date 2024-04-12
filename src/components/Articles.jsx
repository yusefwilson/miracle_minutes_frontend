import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_CONTEXT } from '../App';
import Dropdown from './Dropdown';
import axios from 'axios';
import Cookies from 'js-cookie';

const _get_utc_date = () =>
{
    const currentDate = new Date();
    const utcYear = currentDate.getUTCFullYear();
    const utcMonth = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcDay = currentDate.getUTCDate().toString().padStart(2, '0');

    const utcDateString = `${utcYear}-${utcMonth}-${utcDay}`;

    return utcDateString;
}

export default function Articles()
{
    const navigate = useNavigate();
    const [articles, set_articles] = useState(null); // list of article
    const { logged_in } = useContext(LOGIN_CONTEXT);
    const [error_message, set_error_message] = useState(''); // error message
    const [date, set_date] = useState(_get_utc_date());

    const get_articles = async () =>
    {
        try {
            //send access token and get article
            const access_token = Cookies.get('miracle_minutes_access_token');

            console.log('posting date ' + date);
            const article_result = await axios.post('/articles', { date: date, access_token: access_token });
            console.log(article_result.data.articles);
            const articles = article_result.data.articles;
            set_articles(articles);
            console.log(articles);
            set_error_message('');
        }
        catch (error) {
            console.log(error.response.data.error);
            set_articles([]);
            set_error_message(error.response.data.error);
        }
    }

    useEffect(() =>
    {
        if (!logged_in) { navigate('/login'); return; }
        get_articles();

        // eslint-disable-next-line
    }, [logged_in, navigate, date]);

    const handle_date_change = (event) =>
    {
        //convert date to yyyy-mm-dd format
        const date = event.target.value;
        console.log('handle date change with date: ' + date);
        set_date(date);
    }

    //render error messages or article
    return (
        articles === null ?

            <div className='h-full w-full flex justify-center grid content-center'>
                <img src='/gif/breathing_hourglass.gif' alt='Loading...' width='300' />
            </div>

            :

            <div className='flex flex-col grid content-center justify-center bg-white w-full overflow-y-auto'>
                <div className='bg-gray-400 rounded overflow-y-auto p-16 space-y-8 flex flex-col justify-center'>
                    <h1 className='text-center text-5xl'>Articles</h1>
                    <input className='focus:outline-none border border-gray-300 p-2 rounded-md' type='date' value={date} onChange={handle_date_change} />
                    <div className='flex flex-col space-y-8'>
                        {articles.map((article) => <Dropdown key={article.category} title={article.category} content={article.article} />)}
                        {articles.length === 0 ? <div className='text-center text-white'>
                            Nothing for today! Visit the
                            <button className='p-1 text-purple-500 underline' onClick={() => navigate('/dashboard/shop')}>Shop</button>
                            to buy some articles!</div> : null}
                    </div>
                </div>
                <div className='text-center text-red-300'>{error_message !== '' ? 'Error: ' + error_message : null}</div>
            </div>
    );
}