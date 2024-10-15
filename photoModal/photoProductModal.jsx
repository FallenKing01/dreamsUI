import React, { useState } from 'react';
import axios from 'axios';
import '../photoModal/backMod.css';
const ImageUploadProductForm = ({ productId ,onClose}) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(false);


  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    setPreview(true);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', image);

    const endpoint = `https://dreamsdeluxeapi.azurewebsites.net/upload/uploadimagetoproduct/${productId}`;
    console.log(endpoint);
    try {
      const response = await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('image').click();
  };

  return (
    <div>
      <h2>Image upload form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
       <button type="button" onClick={triggerFileInput} className="customUploadButton-Product">
        Choose image...
      </button>
        <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
        required
        style={{ display: 'none' }} // Hide the actual input field
      />        
        

        <div className='previewContainer'>
          { preview ? <img src={URL.createObjectURL(image)} alt="preview" className='imagePreview'/> : null
        }
        </div>
       
        <button className="closeProfileImage" onClick={onClose}>Close</button>

        <button type="submit" className="saveProfilePhoto">Save changes</button>
      </form>
    </div>
  );
};

export default ImageUploadProductForm;
