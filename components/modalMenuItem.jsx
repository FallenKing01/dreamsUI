import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/ModalContent.css";

const ModalAddMenu = ({ onClose, userId, onAddProduct }) => {
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
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading when submitting

    try {
      const token = localStorage.getItem('token');
      
      // Make the API call to add the product
      const response = await axios.post(
        `https://dreamsdeluxeapi.azurewebsites.net/menu/addmenu/${userId}`, // Use userId directly from props
        {
          name: name.toLowerCase(),
          price: parseFloat(price), 
          type: type.toLowerCase(), // Selected from dropdown
          adminId: userId.toString(), // Convert to string if necessary
          description: productDescription.toLowerCase(),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      // Get the newly added product from the response
      const newProduct = response.data;

      // Update the product list in the parent component by calling onAddProduct
      if (onAddProduct && newProduct) {
        onAddProduct(newProduct);
      }

      // Clear the form fields after successful submission
      setName("");
      setPrice("");
      setType("");
      setProductDescription("");

      // Close the modal
      onClose();
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End loading when the request is finished
    }
  };

  return (
    <form className='modalForm' onSubmit={handleSubmit}>
      <h2 className='titleModal'>Create a new product</h2>

      <label htmlFor="productName" className='modalLbl modalCreateLblName'>Product Name:</label>
      <br />
      <br />
      <input 
        id="productCreateName"
        type="text" 
        placeholder='e.g., Cheesecake' 
        className="modalInput"
        value={name}
        onChange={(e) => setName(e.target.value.toLowerCase())}
        required
      />
      <br />
      <br />  

      <label htmlFor="productPrice" className='modalLbl modalLblPrice'>Product Price:</label>
      <br />
      <br />
      <input 
        id="productCreatePrice"
        type="number" 
        step="0.50"
        min={0.50}
        placeholder="39.99" 
        className="modalInput"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <br />
      <br />

      <label htmlFor="productTypeMenu" className='modalLbl modalLblTip'>Product Type:</label>
      <br />
      <br />
      <select 
        id="productCreateTypeMenu" 
        className="modalInput" 
        value={type} 
        onChange={(e) => setType(e.target.value)} 
        required
      >
        <option value="">--Select Type--</option>
        {foodTypes.map((foodType) => (
          <option key={foodType._id} value={foodType.typeName.toLowerCase()}>
            {foodType.typeName}
          </option>
        ))}
      </select>
      <br />
      <br />

      <label htmlFor="productDescription" className='modalLbl descriptionLbl'>Description:</label>
      <textarea 
        name="productDescription" 
        id="productDescriptionTxtArea" 
        value={productDescription} 
        onChange={(e) => setProductDescription(e.target.value.toLowerCase())}
        className="modalTextarea"
        required 
      />
      <br />
      <br />

      <button type="submit" className='submitCreateMenuProduct' disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Submit'}
      </button>
      <button type="button" className="closeCreateMenuProduct" onClick={onClose}>
        Close
      </button>
    </form>
  );
};

export default ModalAddMenu;
