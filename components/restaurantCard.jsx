// RestaurantCardComponent.js
import React from 'react';
import "../css/restaurantCard.css";
import OpenCard from './openBtn';
import OpenReviews from '../components/reviewOpenBtn'
import RatingCompoenent from './ratingCard';
const RestaurantCardComponent = ({ name, id , rating}) => {

  return (
    <div className="containerRest-restaurant">
      <div className="restaurantBack-restaurant">
        <img className="imgTable-restaurant" src="https://dreamsblob.blob.core.windows.net/appimages/restaurantProfile.jpg" alt="Restaurant" /> {/* Add the image */}
        <div className="buttons-container">

          <OpenCard id={id}  name="restaurantmenu" className="openRestaurant"/>
          <OpenReviews id={id} name="reviews" className="openReviews"/>
         
          <div className="rating-btn">
            <RatingCompoenent rating={rating} />
          </div>

        </div>
        
      
        <div className="bottom-card-restaurant">{name}</div>
       
      </div>
    </div>
  );
};

export default RestaurantCardComponent;