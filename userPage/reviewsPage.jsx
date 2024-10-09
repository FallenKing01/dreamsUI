import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../css/ReviewsComponent.css'; // Import the CSS file
import ReviewCard from '../userPageComponents/reviewCard'; // Import the ReviewCard component
import RatingFilter from '../userPageComponents/reviewFilter'; // Import the RatingFilter component
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import Spinner from '../components/spinner'; // Spinner component to indicate loading
import ReviewSubmission from '../userPageComponents/addRating.jsx'; // Import the ReviewSubmission component


const ReviewsComponent = () => {
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  // Assume you have the clientId from some source (like authentication)
  const clientId = "your-client-id"; // Replace this with actual clientId from your app's state/context

  useEffect(() => {
    if (!restaurantId) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://dreamsdeluxeapi.azurewebsites.net/client/getrecensions/${restaurantId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        const sortedReviews = data.sort((a, b) => b.rating - a.rating);
        setReviews(sortedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  // Handle adding the new review to the reviews state
  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]); // Add the new review to the top
  };

  const filteredReviews = selectedRating
    ? reviews.filter(review => review.rating === parseInt(selectedRating))
    : reviews;

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <UserNavBar />
      <div className="reviews-container">
        <h1 className="reviewsTitle">Reviews for restaurant</h1>
        <button onClick={() => setIsPopupOpen(true)}>Add Review</button>
        <RatingFilter selectedRating={selectedRating} setSelectedRating={setSelectedRating} />
        {filteredReviews.length === 0 ? (
          <p className="noReviewsTxt">No reviews available.</p>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <ReviewCard key={review._id} rating={review.rating} recension={review.recension} />
            ))}
          </div>
        )}
      </div>
        <ReviewSubmission 
            isOpen={isPopupOpen} 
            onClose={() => setIsPopupOpen(false)} 
            restaurantId={restaurantId} 
            clientId={clientId} // Pass clientId to the ReviewSubmission component
            onReviewAdded={handleReviewAdded} 
        />
    </>
  );
};

export default ReviewsComponent;


