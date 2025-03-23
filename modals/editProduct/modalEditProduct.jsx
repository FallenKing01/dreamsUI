import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/modalContent.css';

const ModalEditMenu = ({ onClose, userId, prodId, onUpdateProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state to prevent duplicate submissions
  const [foodTypes, setFoodTypes] = useState([]); // To store the available food types

  // Fetch available food types from the API
  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/foodtype/getfoodtypes`);
        setFoodTypes(response.data); // Assuming API returns an array of food types
      } catch (error) {
        console.error("Error fetching food types:", error);
      }
    };

    fetchFoodTypes();
  }, []);

  // Fetch the product data if we're in edit mode
  useEffect(() => {
    if (prodId) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproduct/${prodId}`);
          const { name, price, type, description } = response.data;
          setName(name);
          setPrice(price);
          setType(type);
          setProductDescription(description);
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      };

      fetchProductData();
    }
  }, [prodId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading when submitting

    try {
      const token = localStorage.getItem('token');
      
      // Only define the PUT request endpoint and payload if editing an existing product
      if (prodId) {
        const url = `https://dreamsdeluxeapi.azurewebsites.net/menu/updateproduct/${prodId}`;

        // Make the PUT request to update the product
        const response = await axios.put(
          url,
          {
            name: name.toLowerCase(),
            price: parseFloat(price),
            type: type.toLowerCase(),
            adminId: userId.toString(),
            description: productDescription.toLowerCase(),
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        const updatedProduct = response.data;

        // Update the product list in the parent component
        if (onUpdateProduct && updatedProduct) {
          onUpdateProduct(updatedProduct);
        }

        // Clear the form fields after successful submission
        setName("");
        setPrice("");
        setType("");
        setProductDescription("");

        // Close the modal
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End loading when the request is finished
    }
  };

  return (
    <form className='modalForm' onSubmit={handleSubmit}>
      <h2 className='titleModalEditProduct'>{prodId ? 'Edit product' : 'View product'}</h2>

      <label htmlFor="productNameEdit" className='modalLbl nameProductEditLbl'>Product Name:</label>
      <input 
        id="productNameEdit"
        type="text" 
        placeholder='e.g., Cheesecake' 
        className="modalInput"
        value={name}
        onChange={(e) => setName(e.target.value.toLowerCase())}
        required
        disabled={!prodId} // Disable input if we're not editing
      />

      <label htmlFor="productPriceEdit" className='modalLbl priceProductEditLbl'>Product Price:</label>
      <input 
        id="productPriceEdit"
        type="number" 
        step="0.50"
        min={0.50}
        placeholder="39.99" 
        className="modalInput"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        disabled={!prodId} // Disable input if we're not editing
      />

      <label htmlFor="productTypeMenuEdit" className='modalLbl modalLblType'>Product Type:</label>
      <select 
        id="productTypeMenuEdit" 
        className="modalInput" 
        value={type} 
        onChange={(e) => setType(e.target.value)} 
        required
        disabled={!prodId} // Disable input if we're not editing
      >
        <option value="">--Select Type--</option>
        {foodTypes.map((foodType) => (
          <option key={foodType._id} value={foodType.typeName.toLowerCase()}>
            {foodType.typeName}
          </option>
        ))}
      </select>

      <label htmlFor="productDescriptionEdit" className='modalLbl descriptionLblEdit'>Description:</label>
      <textarea 
        name="productDescription" 
        id="productDescriptionTxtAreaEdit" 
        value={productDescription} 
        onChange={(e) => setProductDescription(e.target.value.toLowerCase())}
        className="modalTextarea"
        required 
        disabled={!prodId} // Disable input if we're not editing
      />

      {/* Conditionally render the submit button only if we're editing (prodId is present) */}
      {prodId && (
        <button type="submit" className='submitEditMenuProduct' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      )}

      <button type="button" className="closeEditMenuProduct" onClick={onClose}>
        Close
      </button>
    </form>
  );
};

export default ModalEditMenu;
