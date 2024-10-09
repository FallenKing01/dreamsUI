// ReviewCard.jsx
import React from 'react';
import '../userPageCss/reviewCard.css'; // Importing styles specific to ReviewCard

const ReviewCard = ({ rating, recension }) => {
  return (
    <div className="review-card">
      <p className="review-rating">Rating: {rating} / 5</p>
      <p className="review-recension"><strong>Recension:</strong> {recension}</p>
    </div>
  );
};

export default ReviewCard;
