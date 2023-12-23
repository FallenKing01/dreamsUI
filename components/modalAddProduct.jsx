import React, { useState } from 'react';
import axios from 'axios';
import "../css/ModalContent.css";

const ModalAddProduct = ({ onClose, tableId }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`https://dreamsdeluxeapi.azurewebsites.net/products/add/${localStorage.getItem("userId")}`, {
        
        name: name,
        price: parseFloat(price), // Convert price to a float
        qty: parseInt(qty, 10),    // Convert qty to an integer
        table_id: tableId.toString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(localStorage.getItem("userId"));
      console.log(tableId);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className='modalForm' onSubmit={handleSubmit}>
      <h2 className='titleModal'>Create a new product</h2>
      <label htmlFor="productName" className='modalLbl'>Nume produs : </label>
      <br />
      <br />
      <input 
        id="productName"
        type="text" 
        placeholder='Masa 1' 
        className="modalInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <br />  
      <label htmlFor="productPrice"  className='modalLbl'>Pret produs: </label>
      <br />
      <br />
      <input 
        id="productPrice"
        type="number" 
        step="0.01"
        placeholder="39.99" 
        className="modalInput"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <br />
      <br />
      <label htmlFor="productQty"  className='modalLbl'>Numar bucati : </label>
      <input 
        id="productQty"
        type="number" 
        placeholder="5" 
        className="modalInput"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        required
      />
      <br />
      <br />
      <button type="submit" className='submit-btn submitProduct'>Submit</button>
    </form>
  );
};

export default ModalAddProduct;
