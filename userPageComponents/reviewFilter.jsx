import React from 'react';
import '../userPageCss/ratingFilter.css'; // Import the CSS file

const RatingFilter = ({ selectedRating, setSelectedRating }) => {
  return (
    <div className="rating-filter">
      <label className='ratingFilterTitle' htmlFor="rating-select">Filter by rating:</label>
      <select 
        id="rating-select" 
        value={selectedRating} 
        onChange={(e) => setSelectedRating(e.target.value)}
      >
        <option value="">All Ratings</option>
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>
    </div>
  );
};

export default RatingFilter;
