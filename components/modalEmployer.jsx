import React from 'react';
import "../css/ModalCreateEmployer.css"

const ModalEmployer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalContainer">
    <div className="modalEmployer">
      <div className="modalEmployerContent">
        {children}
      
      </div>
    </div>
    </div>
  );
};

export default ModalEmployer;