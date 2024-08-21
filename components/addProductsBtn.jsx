import React, { useState } from 'react';
import Modal from './modal';
import ModalAddProduct from './modalAddProduct';
import "../css/button.css"

const AddProducts = ({tableId,onProductAdded , menuProducts}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="addProducts" >Add Product</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalAddProduct onClose={closeModal} tableId={tableId} onProductAdded={onProductAdded} menuProducts = {menuProducts} />
      </Modal>
    </div>
  );
};

export default AddProducts;