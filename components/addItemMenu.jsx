import React, { useState } from 'react';
import Modal from './modal';
import ModalAddMenu from './modalMenuItem';
import "../css/button.css"

const AddItemInMenu = ({userId,onAddProduct}) => {
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
        <ModalAddMenu onClose={closeModal} userId={userId} onAddProduct={onAddProduct}/>
      </Modal>
    </div>
  );
};

export default AddItemInMenu;