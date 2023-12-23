import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadForm = ({ email }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
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

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Image Upload Form</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="image">Select Image:</label>
        <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />

        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default ImageUploadForm;
