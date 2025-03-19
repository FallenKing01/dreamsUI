import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/addProductInBar.css';
import { Product } from '../classes/product.jsx';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

const ModalAddProduct = ({ onClose, tableId, onProductAdded, menuProducts }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProducts(menuProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      ...product
    })));
  }, [menuProducts]);

  const handleOnSelect = (item) => {
    setSelectedProduct(item);
  };

  const handleQtyChange = (e) => setQty(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`https://dreamsdeluxeapi.azurewebsites.net/products/add/${localStorage.getItem("userId")}`, {
        menuProductId: selectedProduct.id.toString(),
        name: selectedProduct.name,
        price: parseFloat(selectedProduct.price),
        qty: parseInt(qty, 10),
        table_id: tableId.toString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productCreatedId = response.data.id;
      const productCreatedQty = response.data.qty;
      const newProduct = new Product(productCreatedId, selectedProduct.name, parseFloat(selectedProduct.price), productCreatedQty, tableId.toString(), selectedProduct.id.toString());

      onProductAdded(newProduct);
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bar-modal-container">
      <form className='bar-modal-form' onSubmit={handleSubmit}>
        <h2 className='bar-title-modal'>Add product</h2>

        <label className='bar-modal-lbl bar-chose-prod-lbl'>Choose a product:</label>
        <div className='bar-search-bar-product'>
          <ReactSearchAutocomplete
            items={products}
            onSelect={handleOnSelect}
            autoFocus
            placeholder="Search for a product"
            styling={{
              zIndex: 6, // Higher z-index to ensure visibility
              borderRadius: '4px',
              boxShadow: '0 0 5px rgba(0, 123, 255, 1 )',
              height: '38px',
              backgroundColor: '#f9f9f9',
            }}
            formatResult={(item) => (
              <>
                <span>{item.name}</span>
              </>
            )}
          />
        </div>

        <br />

        <label htmlFor="productQty" className='bar-modal-lbl bar-product-qty-lbl'>Quantity:</label>
        <input
          id="productQty"
          type="number"
          placeholder="5"
          className="bar-modal-input"
          value={qty}
          onChange={handleQtyChange}
          required
          min={1}
        />
        <br /><br />

        <button
          type="submit"
          className='bar-submit-btn bar-submit-product'
          disabled={isSubmitting}
        >
          Submit
        </button>
        <button type="button" className="bar-modal-add-product-close-btn" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default ModalAddProduct;
