import React, { useState } from 'react';
import '../css/modalUpdateSize.css'; // Make sure to create this CSS file for styling the modal

const SizeUpdateModal = ({ isOpen, onClose, onUpdate }) => {
  const [size, setSize] = useState(3); // Set default to 3

  const handleUpdate = () => {
    if (size >= 3 && size <= 20) {
      onUpdate(size); // Pass the size for both rows and columns
      onClose();
    } else {
      alert('Size must be between 3 and 20.');
    }
  };

  const handleSizeChange = (e) => {
    const value = Math.max(3, Math.min(20, parseInt(e.target.value, 10) || 3));
    setSize(value);
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Update Map Size</h2>
          <label>
            Size
            <input
              type="number"
              value={size}
              onChange={handleSizeChange}
              min="3"
              max="20"
            />
          </label>
          
          <button onClick={handleUpdate}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default SizeUpdateModal;
