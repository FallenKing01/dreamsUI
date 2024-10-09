import React, { useState } from 'react';
import '../css/searchRestaurant.css';

const SearchRestaurant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    const restaurants = [
        'Pizza Place',
        'Burger Joint',
        'Sushi Spot',
        'Taco Truck',
        'Pasta House'
    ];

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = restaurants.filter(restaurant =>
            restaurant.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };

    return (
        <div className="searchContainer">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for a restaurant"
                className="searchRestaurantInput"
                
            />
        </div>
    );
};

export default SearchRestaurant;
