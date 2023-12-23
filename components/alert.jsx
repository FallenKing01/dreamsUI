import React from 'react';
import "../css/alert.css"


function Alert({message}) {
  
    return (
      
      <div className="alert">
        <h3 className='alertMessage'>{message}</h3>
      </div>
    );
  
}

export default Alert;