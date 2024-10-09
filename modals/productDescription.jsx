import React from 'react';
import '../modals/ProductDescription.css'; // Import CSS for styling
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the close icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProductDescriptionModal = ({ isOpen, onClose, description }) => {
  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close-modal" onClick={onClose} aria-label="Close modal">
                    <FontAwesomeIcon icon={faTimes} />
                </span>
        <h2>Product Description</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProductDescriptionModal;
