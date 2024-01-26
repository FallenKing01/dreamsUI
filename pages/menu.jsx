// Menu.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemInMenu from '../components/addItemMenu';
import '../css/menu.css'; // Import your CSS file for styling
import SidebarAdmin from '../components/sidebarAdmin';
const handleOperation = async (prodId) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found.');
      // Handle the case where the token is not available
      return;
    }

    // Make a DELETE request to the API endpoint with the Authorization header
    const response = await fetch(`https://dreamsdeluxeapi.azurewebsites.net/menudeleteProd/${prodId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // Add any additional headers if needed
      },
    });

    // Check if the request was successful (status code 200-299)
    if (response.ok) {
      console.log(`Item with ID ${prodId} deleted successfully.`);
      // Optionally, you can perform additional actions after deletion
    } else {
      console.error(`Failed to delete item with ID ${prodId}.`);
      // Handle error cases
    }
  } catch (error) {
    console.error('An error occurred while deleting the item:', error);
    // Handle any unexpected errors
  }
};

export default function Menu() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${localStorage.getItem("userId")}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItemList(response.data);
        console.log(response.data);
        console.log(localStorage.getItem("userId"));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="menuContainer">
      <SidebarAdmin />
      <h1 className='menuTitle'>MENU OF THE RESTAURANT</h1>
      <div className="menuContent">
        <table className="menuTable">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nume</th>
              <th>Type</th>
              <th>Pret</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {itemList && itemList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.price}</td>
                <td>
                  {/* Add your operation button or content here */}
                  <button className="delMenuProd"onClick={() => handleOperation(item.id)}>Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="menuButtons">
        <AddItemInMenu userId={localStorage.getItem("userId")}/>
      </div>
    </div>
  );
}
