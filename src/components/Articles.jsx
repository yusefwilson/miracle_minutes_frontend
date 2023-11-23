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
    const [articles, setArticles] = useState(null); // list of article
    const {loggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState(''); // error message
    
    useEffect(() =>
    {
        if(!loggedIn) { navigate('/login'); return;}

        async function get_articles()
        {
            // send access token and get article
            const access_token = Cookies.get('miracle_minutes_access_token');
            const date = _get_utc_date();
            console.log("current date: ", date);
            const article_result = await axios.post('/articles', {date, access_token: access_token});
            
            if(article_result.data.hasOwnProperty('error'))
            {
                setErrorMessage(article_result.data.error);
                return;
            }

            else
            {
                const articles = article_result.data.articles;
                setArticles(articles);
                setErrorMessage('');
                console.log("set articles: ", articles);
            }
        }
        get_articles();

    }, [loggedIn, navigate]);


    //render error messages or article
    return (
        <div className='flex flex-col justify-center bg-yellow-300'>
            <h1>Articles</h1>

            {articles !== undefined && articles !== null && articles.length > 0 &&
            <div className='flex flex-col gap-y-2.5'>
                {articles?.map((article) => <Dropdown key={article.category} title={article.category} content={article.article}/>)}
            </div>}

            {errorMessage === '' && articles === null && <div>Loading...</div>}

            {errorMessage === '' && articles !== null && articles.length === 0 && <div>You have not purchased any articles. If you have, and are seeing this message, contact support.</div>}

            <div className="div">{errorMessage}</div>
        </div>
    );
}