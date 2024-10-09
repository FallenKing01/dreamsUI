import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/searchProductByType.css'; // Include the external CSS file



const SearchProductByType = ({ adminId, onFilter }) => {
    const [foodTypes, setFoodTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        const fetchFoodTypes = async () => {
            try {
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/foodtype/getfoodtypes/${adminId}`);
                setFoodTypes(response.data);
            } catch (error) {
                console.error('Error fetching food types:', error);
            }
        };

        fetchFoodTypes();
    }, [adminId]);

    // Handle food type selection
    const handleChange = (event) => {
        const typeId = event.target.value;
        setSelectedType(typeId);
        onFilter(typeId); // Pass the selected type to the parent
    };

    return (
        <div className="container">
            <label htmlFor="foodType" className="label">Select Food Type:</label>
            <select id="foodType" value={selectedType} onChange={handleChange} className="select">
                <option value="">--Select--</option>
                {foodTypes.map((foodType) => (
                    <option key={foodType._id} value={foodType._id}>
                        {foodType.typeName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchProductByType;
