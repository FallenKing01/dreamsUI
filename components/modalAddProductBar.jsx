import React from 'react';
import "../css/modal.css"
const ModalAddBarProduct = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div > 
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="close-btn modalClose">Close Modal</button>
       
      </div>
    </div>
  );
};

export default ModalAddBarProduct;
