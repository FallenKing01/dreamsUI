import { Link } from 'react-router-dom';
import "../css/openBtn.css"

export default function RatingCompoenent({ rating }){
    return(
      
                <div className="rating-card">
                    <p>{rating.toFixed(1)}/5⭐</p>
                </div>  
       
    );
};