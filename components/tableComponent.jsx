// CardTable.js
import React from 'react';
import "../css/tableCard.css";
import OpenCard from './openBtn';
import DeleteCard from './deleteCard';

const CardTable = ({ name, id, counter }) => {
  const marginLeft = counter *270 ; 

  return (
    <div className="containerTab">
      <div className="cardBack">
        <OpenCard id={id} name="table"/>
        <DeleteCard id={id} name="table" />
        <div className="butom-card">{name}</div>
        
      </div>
    </div>
  );
};

export default CardTable;
