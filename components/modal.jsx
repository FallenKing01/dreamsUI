import React from 'react';
import "../css/modal.css"
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalPhoto"> 
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="close-btn modalClose">Close Modal</button>
       
      </div>
    </div>
  );
};

export default Modal;