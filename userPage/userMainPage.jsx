import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantCardComponent from '../components/restaurantCard.jsx';
import SearchRestaurant from '../components/searchRestaurant.jsx';
import '../css/userPage.css';
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import Spinner from '../components/spinner';
import SearchProductByType from '../components/searchProductByType.jsx';

const UserMainPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const county = localStorage.getItem('county');
    const location = localStorage.getItem('location');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(
                    `https://dreamsdeluxeapi.azurewebsites.net/client/getrestaurants/${county}/${location}`
                );
                setRestaurants(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [county, location]);

    // Filter restaurants by the search term
    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <UserNavBar />
            <div className="cardSpacing"></div>
    
            {loading ? (
                <Spinner />
            ) : filteredRestaurants.length > 0 ? (
                <div className="restaurant-grid">
                    {filteredRestaurants.map((restaurant) => (
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
                <div className="restaurants-not-found-message">
                    No restaurants found for your location
                </div>
            )}
    
            <SearchRestaurant searchTerm={searchTerm} onSearch={handleSearch} />
        </div>
    );
    
};

export default UserMainPage;
