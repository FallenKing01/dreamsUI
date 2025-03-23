import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import UploadPhotoModal from './photoModContent';
import "../css/photoIcon.css";
import PhotoBackModal from './backModal';
// In your component



const PhotoIcon = ({email}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

 
  return (
    <>
      <FontAwesomeIcon icon={faCamera} className="photoIcon" size="2x" onClick={openModal}/>
      <PhotoBackModal isOpen={isModalOpen} onClose={closeModal}>
       
        <UploadPhotoModal email = {email} onClose = {closeModal}/>
        
      </PhotoBackModal>

      {/* Omitted modal component */}
    </>
  );
};

export default PhotoIcon;
