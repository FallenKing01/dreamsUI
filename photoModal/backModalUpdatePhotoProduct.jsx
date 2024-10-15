import React from 'react';
import "./backMod.css"
const PhotoBackModalProductUpdate = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalBackgroundUpdatePhotoProduct">
      <div className="modal-contentPhoto">
        {children}
        <button onClick={onClose} className="close-btn modalClose">Close Modal</button>
       
      </div>
    </div>
  );
};

export default PhotoBackModalProductUpdate;