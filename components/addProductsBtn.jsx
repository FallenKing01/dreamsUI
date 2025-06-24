import React, { useState } from 'react';
import ModalAddBarProduct from './modalAddProductBar';
import ModalAddProduct from './modalAddProduct'; // <--- this was missing!

import "../css/button.css"

const AddProducts = ({ tableId, onProductAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="addProducts">Add product</button>
      <ModalAddBarProduct isOpen={isModalOpen} onClose={closeModal}>
        <ModalAddProduct onClose={closeModal} tableId={tableId} onProductAdded={onProductAdded} />
      </ModalAddBarProduct>
    </div>
  );
};

export default AddProducts;
