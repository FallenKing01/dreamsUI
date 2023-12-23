import React, { useState } from 'react';
import Modal from './modal';
import ModalAddProduct from './modalAddProduct';
import "../css/button.css"

const AddProducts = ({tableId}) => {
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
        <ModalAddProduct onClose={closeModal} tableId={tableId}/>
      </Modal>
    </div>
  );
};

export default AddProducts;