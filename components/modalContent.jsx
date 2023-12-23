import React, { useState } from 'react';
import axios from 'axios';
import "../css/ModalContent.css"

const ModalContent = ({ onClose }) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
  
      await axios.post("https://dreamsdeluxeapi.azurewebsites.net/tables/create", {
        name: name,
        capacity: capacity,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <form  onSubmit={handleSubmit}>
      <h2 className='titleModal'>Create a new table</h2>
      <label htmlFor="tableName" className='modalLbl'>Nume masa : </label>
      <br />
      <br />
      <input 
        id="tableName"
        type="text" 
        placeholder='Masa 1' 
        className="modalInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <br />  
      <label htmlFor="tableCapacity"  className='modalLbl'>Capacitate : </label>
      <br />
      <br />
      <input 
        id="tableCapacity"
        type="number" 
        placeholder="5" 
        className="modalInput"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
      />
      <br />
      <br />
      <button type="submit" className='submit-btn modalSubmit'>Submit</button>
    </form>
  );
};

export default ModalContent;
