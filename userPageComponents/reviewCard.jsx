// ReviewCard.jsx
import React from 'react';
import '../userPageCss/reviewCard.css'; // Importing styles specific to ReviewCard
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {faStar} from "@fortawesome/free-solid-svg-icons";

const ReviewCard = ({ rating, recension }) => {
  return (
    <div className="review-card">
      <p className="review-rating">Rating: {rating} / 5 <FontAwesomeIcon icon={faStar} className="starIcon"/></p>
      <p className="review-recension"><strong>Recension:</strong> {recension}</p>
    </div>
  );
};

export default ReviewCard;
