import React from 'react';
import "./backMod.css"
const PhotoBackModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalBackground">
      <div className="modal-contentPhoto">
        {children}
        <button onClick={onClose} className="close-btn modalClose">Close Modal</button>
       
      </div>
    </div>
  );
};

export default PhotoBackModal;