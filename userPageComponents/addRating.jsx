// ReviewSubmission.jsx
import React, { useState } from 'react';
import '../userPageCss/addRating.css'; // Import the CSS file

const ReviewSubmission = ({ isOpen, onClose, restaurantId, clientId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
    clientId = localStorage.getItem('userId');
  const handleSubmit = async () => {
    if (description.length > 500) {
      alert("Description cannot exceed 500 characters.");
      return;
    }

    const newReview = {
      clientId,
      restaurantId,
      recension: description,
      rating: parseInt(rating),
    };

    try {
      const response = await fetch(`https://dreamsdeluxeapi.azurewebsites.net/client/postrecension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const createdReview = await response.json();
      onReviewAdded(createdReview); // Call the function to add the new review to the list
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 >Add a review</h2>
        <div>
          <label className="addReviewLbl" htmlFor="rating">Rating:</label>
          <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value={0}>Select a rating</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="addReviewLbl" htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            maxLength="500"
          />
        </div>
        {/* Centering the buttons */}
        <div className="button-container">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;
