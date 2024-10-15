import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemInMenu from '../components/addItemMenu';
import '../css/menu.css'; // Import your CSS file for styling
import SidebarAdmin from '../components/sidebarAdmin';
import PhotoIconUpdateProduct from '../photoModal/photoBtnUpdateProduct';
import Spinner from '../components/spinner'; // Spinner component to indicate loading

const deleteProduct = async (prodId, setItemList) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    // Make a DELETE request to the API endpoint
    await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/menudeleteProd/${prodId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Update the itemList state after successful deletion
    setItemList((prevItems) => prevItems.filter(item => item.id !== prodId));

  } catch (error) {
    console.error('An error occurred while deleting the item:', error);
  } 
};

export default function Menu() {
  const [itemList, setItemList] = useState([]);
  const [loader, setLoader] = useState(true); // Loader state to indicate loading

  // Function to add a product to the itemList after successful creation
  const handleAddProduct = (newProduct) => {
    setItemList((prevItems) => [...prevItems, newProduct]); // Add the new product to the current list
  };

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
        
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      {loader ? (
        <Spinner /> // Show spinner when loader is true
      ) : (
        <div className="menuContainer">
          <SidebarAdmin />
          <h1 className="menuTitle">MENU OF THE RESTAURANT</h1>
          <div className="menuContent">
            <table className="menuTable">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Operation</th>
                  <th>Update Picture</th> {/* New column for Update Picture */}
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
                      <button className="delMenuProd" onClick={() => deleteProduct(item.id, setItemList)}>Delete</button>
                    </td>
                    <td>
                      <PhotoIconUpdateProduct productId={item.id} /> {/* Icon to update picture */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="menuButtons">
            <AddItemInMenu userId={localStorage.getItem('userId')} onAddProduct={handleAddProduct} />
          </div>
        </div>
      )}
    </>
  );
}
  