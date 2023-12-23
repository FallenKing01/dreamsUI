import React, { useState } from 'react';
import ModalEmployer from './modalEmployer';
import EmployerModalContent from './employerModalContent';
import "../css/createEmployerBtn.css"
const EmployerCreateBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div>
        <button onClick={openModal} className="createEmpl" >Create Employer</button>
        <ModalEmployer isOpen={isModalOpen} onClose={closeModal}>
         <EmployerModalContent onClose={closeModal}/>
        </ModalEmployer>
      </div>
    );
  };

  export default EmployerCreateBtn;