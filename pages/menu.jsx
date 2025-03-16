import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemInMenu from '../components/addItemMenu';
import '../css/menu.css';
import SidebarAdmin from '../components/sidebarAdmin';
import PhotoIconUpdateProduct from '../photoModal/photoBtnUpdateProduct';
import Spinner from '../components/spinner';
import EditItemInMenu from '../modals/editProduct/editProductBtn';

const deleteProduct = async (prodId, setItemList) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/menudeleteProd/${prodId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    setItemList((prevItems) => prevItems.filter(item => item.id !== prodId));

  } catch (error) {
    console.error('An error occurred while deleting the item:', error);
  } 
};

const onUpdateProduct = (updatedProduct, setItemList) => {
  setItemList((prevItems) =>
    prevItems.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
  );
};

export default function Menu() {
  const [itemList, setItemList] = useState([]);
  const [loader, setLoader] = useState(true); 
  const [page, setPage] = useState(1);

  const handleAddProduct = (newProduct) => {
    setItemList((prevItems) => [...prevItems, newProduct]);
  };

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${localStorage.getItem("userId")}/${page}`, {
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
  }, [page]);

  return (
    <>
      {loader ? (
        <Spinner />
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
                  <th>Update Picture</th>
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
                      <EditItemInMenu userId={localStorage.getItem('userId')} prodId={item.id} onUpdateProduct={(updatedProduct) => onUpdateProduct(updatedProduct, setItemList)} />
                    </td>
                    <td>
                      <PhotoIconUpdateProduct productId={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="menu-pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span className='menuPageNumber'>Page {page}</span>
            <button 
              onClick={() => setPage(page + 1)}
              disabled={itemList.length === 0}
            >
              Next
            </button>
          </div>
          </div>

        

          <div className="menuButtons">
            <AddItemInMenu userId={localStorage.getItem('userId')} onAddProduct={handleAddProduct} />
          </div>
        </div>
      )}
    </>
  );
}
