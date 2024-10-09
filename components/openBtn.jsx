import { Link } from 'react-router-dom';
import "../css/openBtn.css"

export default function OpenCard({ id , name }){
    return(
        <Link to={`/${name}/${id}`}>
        <button className={name === "table" ? "btn-Open" : "openRestaurant"}>Open</button>
</Link>
    );
};