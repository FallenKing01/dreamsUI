import React, { useState } from 'react';
import Modal from '../../components/modal';
import "../../css/button.css"
import ModalEditMenu from './modalEditProduct';
const EditItemInMenu = ({userId,prodId,onUpdateProduct}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className='editProductBtn'>Edit product</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalEditMenu onClose={closeModal} userId={userId} prodId={prodId} onAddProduct={onUpdateProduct}/>
      </Modal>
    </div>
  );
};

export default EditItemInMenu;