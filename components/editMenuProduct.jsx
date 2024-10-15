import React, { useState } from 'react';
import Modal from './modal';
import "../css/button.css"
import ModalEditMenu from './modalEditMenu';
const editMenuProduct = ({userId,onAddProduct}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="addProducts addProductsMenu" >Add product</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalEditMenu onClose={closeModal} userId={userId} onAddProduct={onAddProduct}/>
      </Modal>
    </div>
  );
};

export default editMenuProduct;