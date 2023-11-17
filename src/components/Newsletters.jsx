import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../App";
import Dropdown from "./Dropdown";
import axios from "axios";

export default function Newsletters()
{
    const navigate = useNavigate();
    const [newsletters, setNewsletters] = useState([]); // list of newsletters
    const {loggedIn} = useContext(LoginContext);
    const [errorMessage, setErrorMessage] = useState(''); // error message
    
    useEffect(() =>
    {
        if(!loggedIn) { navigate('/login'); return;}

        async function get_newsletters()
        {
            // send access token and get newsletters
            const access_token = Cookies.get('miracle_minutes_access_token');
            const newsletters_result = await axios.post('/newsletters', {access_token: access_token});
            return newsletters_result.data;
        }
        const newsletter_result = get_newsletters();
        
        if(newsletter_result.error) { setErrorMessage(newsletter_result.error); return; }
        setNewsletters(newsletter_result.newsletters);

    }, []);


    //render error messages or newsletters
    return (
        <div className="flex flex-col justify-center bg-pink-300">
            <h1>Newsletters</h1>
            {errorMessage === '' ?
            <div className="flex flex-col gap-y-2.5">
                {newsletters.map((newsletter) => <Dropdown title={newsletter.title} content={newsletter.content}/>)}
            </div>
            :
            <div className="flex flex-col gap-y-2.5">
                <p>{errorMessage}</p>
            </div>
            }
        </div>
    );
}