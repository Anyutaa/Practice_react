import './App.css';
import styles from './Header.module.css';

import React from 'react'


function App() {
  return (
    <div>
      <h1 className={styles.movableHeader}>Месторождение</h1>
      <button 
        className="icon-button"
        aria-label="Добавить"
        //onClick={handleAddClick}
        style={{ all: 'unset' }} 
      >
        <img 
          src="Icon/Icon_adding.png" 
          alt=""
          className="clickable-icon_adding"
        />
      </button>

      <button 
        className="icon-button"
        aria-label="Удалить"
        //onClick={handleDeleteClick}
        style={{ all: 'unset' }}
      >
        <img 
          src="Icon/Icon_deletion.png" 
          alt=""
          className="clickable-icon_deletion" 
        />
      </button>

    </div>
  );
}

export default App;

