import React, { useState } from 'react';
import Modal from './modal';
import ModalContent from './modalContent';
import "../css/button.css"

const CreateBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="create-btn" >Create table</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default CreateBtn;