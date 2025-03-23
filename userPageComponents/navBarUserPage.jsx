import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons';
import '../userPageCss/userNavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UserNavBar = () => {
  return (
    <nav className="user-navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/user" className="navbar-link">
            <FontAwesomeIcon icon={faHome} className="navbar-icon" size="lg" /> {/* Use size="lg" or "2x" */}
            <span className="navbar-label">Home</span>
          </Link>
        </li>
        
        <li className="navbar-item">
          <Link to="/profile" className="navbar-link">
            <FontAwesomeIcon icon={faUser} className="navbar-icon" size="lg" />
            <span className="navbar-label">Profile</span>
          </Link>
        </li>
        
        <li className="navbar-item">
          <Link to="/events" className="navbar-link">
            <FontAwesomeIcon icon={faTowerBroadcast} className="navbar-icon" size="lg" />
            <span className="navbar-label">Events</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavBar;
