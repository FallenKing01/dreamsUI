import React, { useState } from 'react';
import axios from 'axios';
import "../css/ModalContent.css";

const ModalAddMenu = ({ onClose,  userId }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`https://dreamsdeluxeapi.azurewebsites.net/menu/addmenu/${localStorage.getItem("userId")}`, {
        
        name: name,
        price: parseFloat(price), 
        type: type,    
        amdinId: userId.toString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(localStorage.getItem("userId"));
      console.log(userId);
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
        onChange={(e) => setName(e.target.value.toLowerCase())}
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
      <label htmlFor="productQty"  className='modalLbl modalLblTip '>Tipul produsului : </label>
      <input 
        id="productQty"
        type="text" 
        placeholder="Desert" 
        className="modalInput"
        value={type}
        onChange={(e) => setType(e.target.value.toLowerCase())}
        required
      />
      <br />
      <br />
      <button type="submit" className='submit-btn submitProduct'>Submit</button>
    </form>
  );
};

export default ModalAddMenu;
