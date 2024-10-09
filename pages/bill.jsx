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
  const [totalAmount, setTotalAmount] = useState(0); // State to hold the total amount
  const [loader, setLoader] = useState(true);
  const [modalProducts, setModalProducts] = useState([]);
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
      
      // Calculate the total amount after fetching the items
      const newTotal = response.data.products.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) ;
        const itemQty = parseFloat(item.qty) ;
        return total + (itemPrice * itemQty);
      }, 0);
      setTotalAmount(newTotal);

    } catch (error) {
      console.error('Error:', error);
    }
    

    try {
      const adminId = localStorage.getItem('adminId');
      const getMenuProducts = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalProducts(getMenuProducts.data);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setLoader(false);
    }


  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  const handleProductAdded = (newProduct) => {
    // Ensure the new product has valid price and quantity
    const price = parseFloat(newProduct.price) ;
    const qty = parseFloat(newProduct.qty) ;

    // Update item list and calculate new total
    setItemList(prevItemList => {
      const updatedList = [...prevItemList, { ...newProduct, price, qty }];
      
      // Calculate the new total amount
      const newTotal = updatedList.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQty = parseFloat(item.qty) || 0;
        return total + (itemPrice * itemQty);
      }, 0);
      
      setTotalAmount(newTotal);
      
      return updatedList;
    });
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/products/delall/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Remove the deleted items from the state and update total
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
      setTotalAmount(0); // Reset total amount

      // Print the items using the serial port
      await printItems(itemList);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const printItems = async (items) => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const encoder = new TextEncoderStream();
        const writableStreamClosed = encoder.readable.pipeTo(port.writable);
        const writer = encoder.writable.getWriter();

        const maxNameLength = 15; 
        const maxQtyLength = 5;
        const maxPriceLength = 10; 

        const splitName = (name) => {
          const lines = [];
          while (name.length > maxNameLength) {
            lines.push(name.substring(0, maxNameLength));
            name = name.substring(maxNameLength);
          }
          lines.push(name);
          return lines;
        };

        const formatItem = (name, qty, price) => {
          const nameLines = splitName(name);
          const qtyStr = qty.toString().padStart(maxQtyLength, ' ');
          const priceStr = price.toFixed(2).toString().padStart(maxPriceLength, ' ');

          let formattedLines = nameLines.map((line, index) => {
            if (index === nameLines.length - 1) {
              return line.padEnd(maxNameLength, ' ') + qtyStr + priceStr ;
            } else {
              return line;
            }
          });

          return formattedLines.join('\n');
        };

        writer.write('Item               Qty  Price\n');
        writer.write('--------------------------------\n');

        items.forEach(item => {
          const printData = formatItem(item.name, item.qty, item.price);
          writer.write(`${printData}\n`);
        });

        const totalAmount = items.reduce((total, item) => total + item.price * item.qty, 0);
        writer.write('--------------------------------\n');
        writer.write(`Total:${totalAmount.toFixed(2).toString().padStart(maxNameLength + maxQtyLength + maxPriceLength -10, ' ')} lei\n`);

        writer.close();
        await writableStreamClosed;

        await port.close();
      } catch (error) {
        console.error('Failed to print:', error);
      }
    } else {
      console.error('Web Serial API not supported.');
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

      {!loader && (<div className="billContainer">
        <AddProducts tableId={id} onProductAdded={handleProductAdded} menuProducts={modalProducts} />
        <button className="resetBtn" onClick={handleReset}>Emmit the bill</button>
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
      </div>)}



    </>
  );
}
