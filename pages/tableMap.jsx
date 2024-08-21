import React, { useState, useEffect } from 'react';
import '../css/tableMap.css';
import SizeUpdateModal from '../components/tableMapSizeModal';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';

const ErrorAlert = ({ message, onClose }) => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
    }
  }, [countdown, onClose]);

  return (
    <div className="error-alert">
      <div className="error-header">
        <div className="error-circle"></div>
        <div className="error-title">Error</div>
      </div>
      <div className="error-content">
        <p>{message}</p>
      </div>
      <div className="countdown-bar" style={{ width: `${(countdown / 7) * 100}%` }}></div>
    </div>
  );
};



const TablePlacementSystem = () => {
  const [selectedType, setSelectedType] = useState('table');
  const [history, setHistory] = useState([]);
  const [tableCount, setTableCount] = useState(0);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [cells, setCells] = useState(Array(20 * 20).fill(null));
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);


  const placeBlock = (index) => {
    const previousType = cells[index];
    if (previousType?.type === 'table') {
      setError("You can't change a table position after placement");
      console.log('Table already exists');
      return; // Do nothing if the cell already contains a table
    }
    const newCells = [...cells];
    if (selectedType === 'table') {
      newCells[index] = { type: 'table', content: tableCount + 1 };
      setTableCount(tableCount + 1);
    } else {
      newCells[index] = { type: selectedType, content: '' };
    }
    setCells(newCells);
    setHistory([...history, { index, previousType, newType: newCells[index] }]);
  };

  const undo = () => {
    const lastAction = history.pop();
    if (lastAction) {
      const newCells = [...cells];
      newCells[lastAction.index] = lastAction.previousType;
      if (lastAction.newType?.type === 'table') {
        setTableCount(tableCount - 1);
      }
      setCells(newCells);
      setHistory([...history]);
    }
  };

  const resetMap = () => {
console.log(localStorage.getItem('userId'));
    setCells(Array(rows * cols).fill(null));
    setHistory([]);
    setTableCount(0);
  };

  const updateMapSize = (newRows) => {
    setRows(newRows);
    setCols(newRows);
    setCells(Array(newRows * newRows).fill(null));
    setHistory([]);
    setTableCount(0);
  };

  const saveChanges = async () => {
    try {
      setLoader(true);
      // Filter cells to include only tables and walls
      const filteredCells = cells.map((cell, index) => {
        const row = Math.floor(index / cols) + 1;
        const column = (index % cols) + 1;
        if (cell && (cell.type === 'table' || cell.type === 'wall')) {
          return {
            rows: row,
            columns: column,
            type: cell.type,
            name: cell.content || '',
          };
        }
        return null;
      }).filter(cell => cell !== null); // Remove null entries

      // Send the API request to update the map
      await axios.put(`https://dreamsdeluxeapi.azurewebsites.net/tablemap/update/${localStorage.getItem('userId')}`, {
        totalRows: rows,
        totalColumns: cols,
        cells: filteredCells,
      });

    } catch (error) {
      setError('Failed to save changes.');
      console.error('Error saving changes:', error);
    }
    finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const resizeGrid = () => {
      const grid = document.getElementById('tableMap-grid');
      const cellSize = Math.min(
        (window.innerWidth - 120) / cols,  // Adjust for controls width
        window.innerHeight / rows
      );
      grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
      grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    };
    window.addEventListener('resize', resizeGrid);
    resizeGrid();
    return () => window.removeEventListener('resize', resizeGrid);
  }, [rows, cols]);

  useEffect(() => {
    // Disable scrolling when loader is displayed
    if (loader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [loader]);

  return (
    <div className="tableMap-container">
      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {loader && (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ColorRing />
            <div style={{ color: 'white', fontSize: '20px', marginTop: '10px', marginLeft: '5px' }}>Loading...</div>
          </div>
        </div>
      )}
      <SizeUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={updateMapSize}
      />
      <div className="grid-background"></div>
      <div className="tableMap-celscontainer">
        <div id="tableMap-grid" className="tableMap-grid">
          {cells.map((cell, index) => (
            <div
              key={index}
              className={`tableMap-cell ${cell?.type || ''}`}
              onClick={() => placeBlock(index)}
            >
              {cell?.type === 'table' ? cell.content : ''}
            </div>
          ))}
        </div>
      </div>
      <div id="tableMap-controls" className="tableMap-controls">
        <button onClick={() => setSelectedType('table')}>Table</button>
        <button onClick={() => setSelectedType('wall')}>Wall</button>
        <button onClick={() => setSelectedType('path')}>Path</button>
        <button onClick={undo}>Undo</button>
        <button className='reset-map' onClick={resetMap}>Reset map</button>
        <button className='save-btn' onClick={saveChanges} >Save changes</button>
        <button onClick={() => setIsModalOpen(true)}>Update map size</button>
        <div id="tableMap-counter">Tables: {tableCount}</div>
      </div>
    </div>
  );
};

export default TablePlacementSystem;
