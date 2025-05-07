// src/TableMap.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../css/tableMapView.css';
Modal.setAppElement('#root'); // Replace '#root' with the id of your app's root element if different

const TableMap = ({ adminId }) => {
  const [tableMap, setTableMap] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchTableMap = async () => {
    try {
      const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tablemap/gettablemap/${adminId}`);
      setTableMap(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching table map:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

 

  return (
    <div>
      <button onClick={fetchTableMap} className='showTableMap'>Show table map</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modalContent">
        {tableMap && (
          <div
            className={`gridContainer ${tableMap.totalRows > 10 ? 'scaled' : ''}`}
            style={{ gridTemplateColumns: `repeat(${tableMap.totalColumns}, 50px)` }}
          >
            {Array.from({ length: tableMap.totalRows * tableMap.totalColumns }).map((_, index) => {
              const row = Math.floor(index / tableMap.totalColumns) + 1;
              const col = (index % tableMap.totalColumns) + 1;
              const cell = tableMap.cells.find(c => c.rows === row && c.columns === col);
              const cellClass = cell ? (cell.type === 'table' ? 'table' : 'wall') : 'path';
              return (
                <div key={index} className={`gridCell ${cellClass}`}>
                  {cell && cell.type === 'table' ? cell.name : ''}
                </div>
              );
            })}
            <button  onClick={closeModal} className={`closeMapView ${tableMap.totalRows > 10 ? 'scaledclose' : ''}`}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TableMap;
