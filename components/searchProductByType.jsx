import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/searchProductByType.css'; // Include the external CSS file

const SearchProductByType = ({ adminId, onFilter }) => {
    const [foodTypes, setFoodTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        const fetchFoodTypes = async () => {
            try {
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/foodtype/getfoodtypes`);
                setFoodTypes(response.data);
            } catch (error) {
                console.error('Error fetching food types:', error);
            }
        };

        fetchFoodTypes();
    }, [adminId]);

    // Handle food type selection
    const handleChange = (event) => {
        const selectedTypeId = event.target.value; // Get the selected type ID
        setSelectedType(selectedTypeId); // Update the selected type state

        // Find the selected food type object
        const selectedFoodType = foodTypes.find(foodType => foodType._id === selectedTypeId);
        
        // Get the type name from the selected food type object
        const typeName = selectedFoodType ? selectedFoodType.typeName : '';
        
        console.log(typeName); // Log the selected type name
        onFilter(typeName); // Pass the selected type name to the parent
    };

    return (
        <div className="container">
            <label htmlFor="foodType" className="label">Select Food Type:</label>
            <select id="foodType" value={selectedType} onChange={handleChange} className="select">
                <option value="">No type selected</option>
                {foodTypes.map((foodType) => (
                    <option key={foodType._id} value={foodType._id}>
                        {foodType.typeName} {/* Display the food type name */}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchProductByType;
