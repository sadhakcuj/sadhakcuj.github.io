import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Udyam Registration</h1>
          <span className="subtitle">MSME Registration Portal</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 