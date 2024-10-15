import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import ImageUploadProductForm from './photoProductModal';
import PhotoBackModalProductUpdate from './backModalUpdatePhotoProduct';
import "../css/PhotoIcon.css";

// In your component



const PhotoIconUpdateProduct = ({productId}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

 
  return (
    <>
      <FontAwesomeIcon icon={faCamera} className="productPhotoUpdateIcon"  onClick={openModal}/>
      <PhotoBackModalProductUpdate isOpen={isModalOpen} onClose={closeModal}>
       
        <ImageUploadProductForm productId = {productId} onClose = {closeModal}/>
        
      </PhotoBackModalProductUpdate>

      {/* Omitted modal component */}
    </>
  );
};

export default PhotoIconUpdateProduct;
