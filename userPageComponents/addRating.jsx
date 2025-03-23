import React, { useState } from 'react';
import ReviewError from '../components/reviewError'; 
import '../userPageCss/addRating.css';

const ReviewSubmission = ({ isOpen, onClose, restaurantId, clientId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  clientId = localStorage.getItem('userId');

  // Function to reset all states
  const resetStates = () => {
    setRating(0);
    setDescription('');
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null); // Reset error before validation

    // Validate inputs
    if (rating === 0) {
      setError({ title: 'Error', message: 'Please select a rating.' });
      return;
    }
    if (description.length > 500) {
      setError({ title: 'Error', message: 'Description is too long (max 500 characters).' });
      return;
    }
    if (description.length < 10) {
      setError({ title: 'Error', message: 'Description is too short (min 10 characters).' });
      return;
    }

    // Build the new review object
    const newReview = {
      clientId,
      restaurantId,
      recension: description,
      rating: parseInt(rating),
    };

    // Send the review to the API
    try {
      const response = await fetch(`https://dreamsdeluxeapi.azurewebsites.net/client/postrecension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const createdReview = await response.json();
      onReviewAdded(createdReview); // Add the new review to the list
      resetStates(); // Reset states after successful submission
      onClose(); // Close the submission form
    } catch (error) {
      setError({ title: 'Error', message: `Failed to submit review: ${error.message}` });
    }
  };

  // Close popup and reset states
  const handleClose = () => {
    resetStates(); // Reset states when closing the popup
    onClose(); // Trigger the parent `onClose` function
  };

  // Do not render if the popup is closed
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add a Review</h2>

        {/* Show the error alert if there is an error */}
        {error && (
          <ReviewError
            title={error.title}
            message={error.message}
            onClose={() => setError(null)} // Reset error when alert is closed
          />
        )}

        {/* Rating Selection */}
        <div>
          <label className="addReviewLbl" htmlFor="rating">Rating:</label>
          <select id="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
            <option value={0}>Select a rating</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        {/* Description Input */}
        <div>
          <label className="addReviewLbl" htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="500"
          />
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button onClick={handleSubmit} className="submit-review">Submit</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;
