import React from 'react';
import { ColorRing } from 'react-loader-spinner';

const Spinner = () => {
    return (
        <div style={{ 
            position: 'fixed',  // Changed to fixed to cover the entire viewport
            top: 0, 
            left: 0, 
            width: '100vw',     // Full width of the viewport
            height: '100vh',    // Full height of the viewport
            backgroundColor: 'rgba(0, 0, 0, 1)',  // Semi-transparent background
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999        // High z-index to ensure it's on top of other elements
        }}>
          <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
          }}>
            <ColorRing />
            <div style={{ 
                color: 'white', 
                fontSize: '20px', 
                marginTop: '10px' 
            }}>
              Loading...
            </div>
          </div>
        </div>
    );
};

export default Spinner;
