import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCutlery, faUser, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons';
import '../userPageCss/UserNavBar.css'; // Import your CSS file

const UserNavBar = () => {
  return (
    <nav className="user-navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <FontAwesomeIcon icon={faHome} className="navbar-icon" />
          <span className="navbar-label">Home</span>
        </li>
        <li className="navbar-item">
          <FontAwesomeIcon icon={faCutlery} className="navbar-icon" />
          <span className="navbar-label">Menu</span>
        </li>
        <li className="navbar-item">
          <FontAwesomeIcon icon={faUser} className="navbar-icon" />
          <span className="navbar-label">Profile</span>
        </li>
        <li className="navbar-item">
          <FontAwesomeIcon icon={faTowerBroadcast} className="navbar-icon" />
          <span className="navbar-label">Broadcast</span>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavBar;
