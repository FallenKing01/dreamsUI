import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/bill.css";
import AddProducts from '../components/addProductsBtn';
import { ColorRing } from 'react-loader-spinner';
import Spinner from '../components/spinner';

export default function Bill() {
  const { id } = useParams();
  const [itemList, setItemList] = useState([]);
  const [tableName, setTableName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [modalProducts, setModalProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [id]);

  const fetchItems = async () => {
    setLoader(true);
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItemList(data.products);
      setTableName(data.name);
      setTotalAmount(data.products.reduce((total, item) => total + parseFloat(item.price) * parseFloat(item.qty), 0));

      const adminId = localStorage.getItem('adminId');
      const { data: menuData } = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${adminId}/${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setModalProducts(menuData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    const price = parseFloat(newProduct.price);
    const qty = parseFloat(newProduct.qty);
    setItemList(prev => {
      const updatedList = [...prev, { ...newProduct, price, qty }];
      setTotalAmount(updatedList.reduce((total, item) => total + parseFloat(item.price) * parseFloat(item.qty), 0));
      return updatedList;
    });
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://dreamsdeluxeapi.azurewebsites.net/products/delall/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItemList(prev => {
        const updatedList = prev.filter(item => item.id !== productId);
        setTotalAmount(updatedList.reduce((total, item) => total + parseFloat(item.price) * parseFloat(item.qty), 0));
        return updatedList;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.put(`https://dreamsdeluxeapi.azurewebsites.net/tables/reset/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await printBillToThermalPrinter(itemList);

      setItemList([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error resetting table or printing:', error);
    } finally {
      setLoading(false);
    }
  };

  const printBillToThermalPrinter = async (items) => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const encoder = new TextEncoderStream();
        const writableStreamClosed = encoder.readable.pipeTo(port.writable);
        const writer = encoder.writable.getWriter();

        const ESC = '\x1B';
        const LF = '\x0A';
        const CUT = '\x1D\x56\x00';

        // Adjusted column widths to fit the item name and local total on the last line
        const maxNameLength = 12;  // Item name length per line (12 characters per line)
        const maxQtyLength = 2;    // Quantity length
        const maxPriceLength = 3;  // Price length
        const maxTotalLength = 6;  // Local total length

        // Function to split product names into 12 character chunks
        const splitName = (name) => {
          const lines = [];
          while (name.length > maxNameLength) {
            lines.push(name.substring(0, maxNameLength));
            name = name.substring(maxNameLength);
          }
          lines.push(name);
          return lines;
        };

        // Function to format each item with the price, qty, and total on the last line
        const formatItem = (name, qty, price) => {
          const nameLines = splitName(name);
          const qtyStr = qty.toString().padStart(maxQtyLength, ' ');
          const priceStr = price.toFixed(2).toString().padStart(maxPriceLength, ' ');
          const localTotal = (qty * price).toFixed(2).toString().padStart(maxTotalLength, ' ');

          // Format the last line (name, qty, price, total all on the same line)
          const formattedName = nameLines.join(LF); // Print name lines

          return `${formattedName}:${qtyStr}bucX${priceStr}lei=${localTotal}`;
        };

        // Start printing
        writer.write(ESC + '!' + '\x38'); // Bold, large text
        writer.write('Bill' + LF);
        writer.write(ESC + '!' + '\x00'); // Reset font
        writer.write('--------------------------------' + LF);
        writer.write('Item         Qty  Price   Total' + LF); // Adjusted header
        writer.write('--------------------------------' + LF);

        // Print items
        items.forEach(item => {
          writer.write(formatItem(item.name, item.qty, item.price) + LF);
        });

        // Print the total amount
        const totalAmount = items.reduce((total, item) => total + item.price * item.qty, 0);
        writer.write('--------------------------------' + LF);
        writer.write(`Total:${totalAmount.toFixed(2).toString().padStart(maxNameLength + maxQtyLength + maxPriceLength - 10, ' ')} lei` + LF);
        writer.write(LF + LF + LF + CUT); // Cut the paper after printing

        // Close the writer and the connection to the port
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
      {loader ? (
        <div className="loadingContainer">
          <Spinner />
        </div>
      ) : (
        <div className="billContainer">
          <AddProducts tableId={id} onProductAdded={handleProductAdded} menuProducts={modalProducts} />

          <button className="resetBtn" onClick={handleReset} disabled={loading}>
            {loading ? 'Processing...' : 'Emit the bill'}
          </button>

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
                      <button className="deleteButton" id="delte-item-menu" onClick={() => handleDelete(item.id)}>Delete</button>
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
