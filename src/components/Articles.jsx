import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';
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
    const {logged_in} = useContext(LoginContext);
    const [error_message, set_error_message] = useState(''); // error message
    
    useEffect(() =>
    {
        if(!logged_in) { navigate('/login'); return;}

        async function get_articles()
        {
            try
            {
                //send access token and get article
                const access_token = Cookies.get('miracle_minutes_access_token');

                const date = _get_utc_date();
                console.log("current date: ", date);

                const article_result = await axios.post('/articles', {date, access_token: access_token});
                console.log("article result: ", article_result);
                
                const articles = article_result.data.articles;
                set_articles(articles);
                set_error_message('');
                console.log("set articles: ", articles);
            }
            catch (error)
            {
                console.log('articles error: ', error);
                set_error_message(error.response.data.error);
            }
        }
        get_articles();

    }, [logged_in, navigate]);


    //render error messages or article
    return (
        <div className='flex flex-col grid content-start justify-center bg-yellow-300 w-full'>
            <h1 className='text-center'>Articles</h1>

            <div className='flex flex-col gap-y-2.5'>
                {articles?.map((article) => <Dropdown key={article.category} title={article.category} content={article.article}/>)}
            </div>

            <div className="div">{error_message}</div>
        </div>
    );
}