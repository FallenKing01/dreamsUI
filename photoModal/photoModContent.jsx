import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadForm = ({ email ,onClose}) => {
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

    const endpoint = `https://dreamsdeluxeapi.azurewebsites.net/upload/upload_image/${email}`;

    try {
      const response = await axios.post(endpoint, formData, {
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
      <h1>Image upload form</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
       <button type="button" onClick={triggerFileInput} className="customUploadButton">
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

export default ImageUploadForm;
