import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../App";

export default function Newsletters()
{
    const navigate = useNavigate();
    const [newsletters, setNewsletters] = useState([]); // list of newsletters
    const {loggedIn} = useContext(LoginContext);
    
    useEffect(() =>
    {
        if(!loggedIn) { navigate('/login'); return;}

        // send access token and get newsletters

        //handle errors

    }, []);


    //render error messages or newsletters
    return (
        <div className="flex justify-center bg-pink-300">
            <h1>Newsletters</h1>
        </div>
    );
}