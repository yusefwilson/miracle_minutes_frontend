import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../App";
import Dropdown from "./Dropdown";
import axios from "axios";

export default function Articles()
{
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]); // list of article
    const {loggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState(''); // error message
    
    useEffect(() =>
    {
        if(!loggedIn) { navigate('/login'); return;}

        async function get_articles()
        {
            // send access token and get article
            const access_token = Cookies.get('miracle_minutes_access_token');
            const article_result = await axios.post('/articles', {access_token: access_token});
            return article_result.data;
        }
        const article_result = get_articles();
        
        if(article_result.error) { setErrorMessage(article_result.error); return; }
        setArticles(article_result.articles);

    }, []);


    //render error messages or article
    return (
        <div className="flex flex-col justify-center bg-pink-300">
            <h1>Articles</h1>
            {errorMessage === '' ?
            <div className="flex flex-col gap-y-2.5">
                {articles.map((newsletter) => <Dropdown title={newsletter.title} content={newsletter.content}/>)}
            </div>
            :
            <div className="flex flex-col gap-y-2.5">
                <p>{errorMessage}</p>
            </div>
            }
        </div>
    );
}