import React, { useState } from 'react';
import axios from 'axios';
import '../photoModal/backMod.css';

const ImageUploadProductForm = ({ productId, onClose }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // Added state for disabling button

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    setPreview(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || isDisabled) return; // Prevent submission if no image or already disabled

    setIsDisabled(true); // Disable button immediately after click

    const formData = new FormData();
    formData.append('file', image);

    const endpoint = `https://dreamsdeluxeapi.azurewebsites.net/upload/uploadimagetoproduct/${productId}`;
    

    try {
      await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      setIsDisabled(false); // Re-enable button on error so user can retry
    }
  };

  const triggerFileInput = () => {
    document.getElementById('image').click();
  };

  return (
    <div>
      <h2>Image Upload Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <button type="button" onClick={triggerFileInput} className="customUploadButton-Product">
          Choose Image...
        </button>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={{ display: 'none' }} // Hide the actual input field
        />

        <div className="previewContainer">
          {preview && <img src={URL.createObjectURL(image)} alt="preview" className="imagePreview" />}
        </div>

        <button type="button" className="closeProfileImage" onClick={onClose}>
          Close
        </button>

        <button type="submit" className="saveProfilePhoto" disabled={isDisabled}>
          {isDisabled ? 'Uploading...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ImageUploadProductForm;
