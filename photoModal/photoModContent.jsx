import React, { useState } from 'react';
import axios from 'axios';
import '../photoModal/backMod.css';

const ImageUploadForm = ({ email, onClose }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setPreview(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || isDisabled) return; // Prevent double submission
  
    setIsDisabled(true); // Disable button immediately
  
    const formData = new FormData();
    formData.append('file', image);
    const endpoint = `https://dreamsdeluxeapi.azurewebsites.net/upload/upload_image/${email}`;
  
    try {
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      onClose(); // Close modal after successful upload
    } catch (error) {
      console.error('Error:', error);
      setIsDisabled(false); // Re-enable button for retry
    }
  };
  

  const triggerFileInput = () => {
    document.getElementById('image').click();
  };

  return (
    <div>
      <h1 className='uploadEmployeeImg'>Image Upload Form</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <button type="button" onClick={triggerFileInput} className="customUploadButton">
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
        <button type="submit" className="saveProfilePhoto" disabled={isDisabled? 'disabled' : ''}>
          {isDisabled ? 'Uploading...' : 'Save Changes'}
        </button>

    

      </form>
    </div>
  );
};

export default ImageUploadForm;
