import { Link } from 'react-router-dom';
import "../css/openBtn.css"

export default function OpenEmpl({ id , name}){
    return(
        <Link to={`/${name}/${id}`}>
            <button className="openEmpl">Open</button>
        </Link>
    );
};