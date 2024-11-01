import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { LOGIN_CONTEXT } from '../App';
import Loading from './Loading';
import ErrorBox from './ErrorBox';
import ArticleTeaser from './ArticleTeaser';

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
    const { logged_in } = useContext(LOGIN_CONTEXT);

    const [articles, set_articles] = useState(null); // list of article
    const [error_message, set_error_message] = useState(''); // error message
    const [date, set_date] = useState(_get_utc_date());

    const get_articles = async () =>
    {
        try
        {
            //send access token and get article
            const access_token = Cookies.get('miracle_minutes_access_token');

            const article_result = await axios.post('/articles', { date: date, access_token: access_token });
            const articles = article_result.data.articles;
            set_articles(articles);
            set_error_message('');
        }
        catch (error)
        {
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

            <Loading />

            :


            <div className='flex flex-col p-4 w-full overflow-y-auto space-y-4 justify-center items-center'>

                <div className='flex flex-col w-full sm:w-1/3 space-y-4 self-center bg-gray-400 border-2 border-black rounded p-4'>
                    <h1 className='text-2xl self-center lg:text-5xl font-bold'>Articles</h1>
                    <input className='focus:outline-none self-center border-2 border-black p-2 rounded-md 2' type='date' min='2024-10-6' max={_get_utc_date()} value={date} onChange={handle_date_change} />
                </div>

                <div className='flex flex-wrap p-4 justify-between'>
                    {articles.map((article_item) => <ArticleTeaser key={article_item.topic} title={article_item.topic} content={article_item.article} />)}
                    {articles.length === 0 ? <div className='text-center text-gray-400'>
                        Nothing for today! Visit the
                        <button className='p-1 text-black underline' onClick={() => navigate('/dashboard/shop')}>Shop</button>
                        to buy some articles!</div> : null}
                </div>
                {error_message !== '' ? <ErrorBox error={error_message} width='w-1/3' /> : null}

            </div>
    );
}