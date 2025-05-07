import React from 'react';
import '../css/searchRestaurant.css';

const SearchRestaurant = ({ searchTerm, onSearch }) => {
    return (
        <div className="searchContainer">
            <input
                type="text"
                value={searchTerm}
                onChange={onSearch}
                placeholder="Search for a restaurant"
                className="searchRestaurantInput"
            />
        </div>
    );
};

export default SearchRestaurant;
