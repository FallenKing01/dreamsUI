import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantCardComponent from '../components/restaurantCard.jsx';
import SearchRestaurant from '../components/searchRestaurant.jsx';
import '../css/userPage.css';
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import Spinner from '../components/spinner'; // Spinner component to indicate loading
import SearchProductByType from '../components/searchProductByType.jsx';

const UserMainPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's county and location from localStorage
    const county = localStorage.getItem('county');
    const location = localStorage.getItem('location');
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Call the API to get restaurants based on county and location
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/client/getrestaurants/${county}/${location}`);
                setRestaurants(response.data);  // Store restaurants data in state
                setLoading(false);  // Stop the loading spinner
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setLoading(false);
            }
            
        };

        fetchRestaurants();
    }, [county, location]);

    return (
        <div>
            <UserNavBar />
            <div className='cardSpacing'></div>

            {loading ? (
                <Spinner />
            ) : restaurants.length > 0 ? (
                <div>
                    {restaurants.map((restaurant) => (
                        <RestaurantCardComponent 
                            key={restaurant._id} 
                            name={restaurant.companyName} 
                            id={restaurant._id} 
                            totalAmount={restaurant.totalAmount} 
                            location={restaurant.location}
                            rating={restaurant.finalRating}
                            imageUrl={restaurant.imageUrl}
                        />
                    ))}
                </div>
            ) : (
                <div className='restaurants-not-found-message'>No restaurants found for your location</div>
            )}

            <SearchRestaurant />
        </div>
    );
};

export default UserMainPage;
