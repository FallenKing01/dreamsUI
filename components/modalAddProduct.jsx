import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ModalContent.css';
import { Product } from '../classes/product.jsx';

const ModalAddProduct = ({ onClose, tableId, onProductAdded ,menuProducts}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('');
  const [filter, setFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        
       

        setProducts(menuProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleProductChange = (e) => setSelectedProduct(e.target.value);

  const handleQtyChange = (e) => setQty(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); 

    try {
      const token = localStorage.getItem('token');
      const selectedProductData = products.find(product => product.name === selectedProduct);
  
      if (!selectedProductData) {
        throw new Error('Selected product not found');
      }
  
      const { price: selectedProductPrice, id: menuProductId } = selectedProductData;
  
      const response = await axios.post(`https://dreamsdeluxeapi.azurewebsites.net/products/add/${localStorage.getItem("userId")}`, {
        menuProductId: menuProductId.toString(),
        name: selectedProduct,
        price: parseFloat(selectedProductPrice),
        qty: parseInt(qty, 10),
        table_id: tableId.toString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const productCreatedId = response.data.id;
      const productCreatedQty = response.data.qty;
      const newProduct = new Product(productCreatedId, selectedProduct, parseFloat(selectedProductPrice), productCreatedQty, tableId.toString(),menuProductId.toString());
  
      onProductAdded(newProduct);
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      setIsSubmitting(false); 
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

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
        onChange={handleFilterChange}
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
        onChange={handleProductChange}
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
        onChange={handleQtyChange}
        required
        min={1}
      />
      <br />
      <br />

      <button 
        type="submit" 
        className='submit-btn submitProduct'
        disabled={isSubmitting} // Disable the button if submitting
      >
        
        Submit
      </button>
    </form>
  );
};

export default ModalAddProduct;
