import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../userPageCss/productCard.css';
import ProductDescriptionModal from '../modals/productDescription';

const ProductCard = ({ productId, imageUrl, description, price, name }) => {
    const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

    const openModal = () => {
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setModalOpen(false); // Close the modal
    };

    return (
        <div className="product-card">
            <div
                className='product-image'
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            <div className="product-info" id={productId}>
                <h2 className="product-name">{name}</h2>
                <button className='viewProductDetails' onClick={openModal}>
                    View details
                </button>
                <p className="product-price">${price.toFixed(2)}</p>
            </div>

            <ProductDescriptionModal isOpen={isModalOpen} onClose={closeModal} description={description} />
        </div>
    );
};

// PropTypes for validation
ProductCard.propTypes = {
    productId: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
};

export default ProductCard;
    