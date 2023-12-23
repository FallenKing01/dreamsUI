import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/bill.css";
import AddProducts from '../components/addProductsBtn';

export default function Bill() {
  const { id } = useParams(); 
  const [itemList, setItemList] = useState([]);
  const [tableName, setTableName] = useState("");
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettable/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItemList(response.data.products);
        setTableName(response.data.name);
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchItems();
  }, [id]);
  const handleDelete = async (id,emplId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/products/delall/${id}/${emplId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Remove the deleted items from the state
      setItemList(itemList.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReset = async () => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(`https://dreamsdeluxeapi.azurewebsites.net/tables/reset/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Clear the itemList state
      setItemList([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const totalAmount = itemList.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="billContainer">
      <AddProducts tableId={id}/>
      <button className="resetBtn" onClick={handleReset}>Emmite the bill</button>
      <div className="billContent">
        <h1>Bill for {tableName}</h1>
        <table className="billTable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nume</th>
            <th>Cantitate</th>
            <th>Pret</th>
            <th>Action</th>
          </tr>
        </thead>
          <tbody>
            {itemList.map((item,index) => (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                 <td>
                  <button className="deleteButton" onClick={() => handleDelete(item.id,localStorage.getItem("userId"))}>Delete</button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="billPrice">Total: {totalAmount}</h2>
      </div>
    </div>
  );
}