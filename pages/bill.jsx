import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/bill.css";
import AddProducts from '../components/addProductsBtn';
import { ColorRing } from 'react-loader-spinner';

export default function Bill() {
  const { id } = useParams();
  const [itemList, setItemList] = useState([]);
  const [tableName, setTableName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [modalProducts, setModalProducts] = useState([]);

  // Fetch items for the bill
  const fetchItems = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItemList(response.data.products);
      setTableName(response.data.name);

      const newTotal = response.data.products.reduce((total, item) => {
        const itemPrice = parseFloat(item.price);
        const itemQty = parseFloat(item.qty);
        return total + (itemPrice * itemQty);
      }, 0);
      setTotalAmount(newTotal);

    } catch (error) {
      console.error('Error fetching items:', error);
    }

    try {
      const adminId = localStorage.getItem('adminId');
      const getMenuProducts = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalProducts(getMenuProducts.data);
    } catch (error) {
      console.error('Error fetching menu products:', error);
    } finally {
      setLoader(false);
    }
  };

  // Trigger the fetchItems function when component mounts
  useEffect(() => {
    fetchItems();
  }, [id]);

  // Handle adding a new product
  const handleProductAdded = (newProduct) => {
    const price = parseFloat(newProduct.price);
    const qty = parseFloat(newProduct.qty);
    setItemList(prevItemList => {
      const updatedList = [...prevItemList, { ...newProduct, price, qty }];
      const newTotal = updatedList.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQty = parseFloat(item.qty) || 0;
        return total + (itemPrice * itemQty);
      }, 0);
      setTotalAmount(newTotal);
      return updatedList;
    });
  };

  // Handle deleting a product
  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/products/delall/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItemList(prevItemList => {
        const updatedList = prevItemList.filter(item => item.id !== productId);
        const newTotal = updatedList.reduce((total, item) => {
          const itemPrice = parseFloat(item.price) || 0;
          const itemQty = parseFloat(item.qty) || 0;
          return total + (itemPrice * itemQty);
        }, 0);
        setTotalAmount(newTotal);
        return updatedList;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Handle resetting the bill
  const handleReset = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://dreamsdeluxeapi.azurewebsites.net/tables/reset/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItemList([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error resetting table:', error);
    }
  };

  return (
    <>
      {loader && (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ColorRing />
            <div style={{ color: 'white', fontSize: '20px', marginTop: '10px', marginLeft: '5px' }}>Loading...</div>
          </div>
        </div>
      )}

      {!loader && (
        <div className="billContainer">
          {/* Add Product Button */}
          <AddProducts tableId={id} onProductAdded={handleProductAdded} menuProducts={modalProducts} />

          {/* Reset Button */}
          <button className="resetBtn" onClick={handleReset}>Emit the bill</button>

          <div className="billContent">
            <h1>Bill for {tableName}</h1>
            <table className="billTable">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>
                      <button className="deleteButton" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="billPrice">Total: {totalAmount.toFixed(2)} lei</h2>
          </div>
        </div>
      )}
    </>
  );
}
