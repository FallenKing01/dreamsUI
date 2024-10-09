import { Link } from 'react-router-dom';
import "../css/openBtn.css"

export default function OpenReviews({ id , name }){
    return(
        <Link to={`/${name}/${id}`}>
        <button className="openReviews">Reviews</button>
</Link>
    );
};