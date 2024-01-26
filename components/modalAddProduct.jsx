import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ModalContent.css';
const ModalAddProduct = ({ onClose, tableId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const userResponse = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuser/${localStorage.getItem("userId")}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const adminId = userResponse.data.adminId;

        const menuResponse = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/menu/getproducts/${adminId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setProducts(menuResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedProductPrice = filteredProducts.find(product => product.name === selectedProduct)?.price || 0;

      await axios.post(`https://dreamsdeluxeapi.azurewebsites.net/products/add/${localStorage.getItem("userId")}`, {
        name: selectedProduct,
        price: parseFloat(selectedProductPrice),
        qty: parseInt(qty, 10),
        table_id: tableId.toString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
      
      <label htmlFor="productFilter" className='modalLbl'>Filter Products:</label>
      <input 
        id="productFilter"
        type="text" 
        placeholder="Type to filter products"
        className="modalInput"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      
      <br />
      <br />

      <label htmlFor="productSelect" className='modalLbl'>Choose a product:</label>
      <br />
      <br />
      <select
        id="productSelect"
        className="modalInput"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        required
      >
        <option value="" disabled>Select a product</option>
        {filteredProducts.map((product) => (
          <option key={product.id} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>
      <br />
      <br />

      <label htmlFor="productQty" className='modalLbl'>Quantity:</label>
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
