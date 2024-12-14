import React, { useState } from 'react';
import "../css/nonadminsidebar.css";
import { useNavigate } from 'react-router-dom';
import { faHome, faBars, faTimes ,faSignOut} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function SidebarUser() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

    const handleLogout = () => {
      // Perform any logout logic if needed (e.g., clearing tokens)
      navigate('/login');
    };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="nonadmin-open-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} /> Open Sidebar
      </button>

      <div className={`nonadmin-sidebar ${isOpen ? 'nonadmin-sidebar-open' : ''}`}>
        <div className="nonadmin-menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} className="nonadmin-menu-icon" />
        </div>
        <div className={`nonadmin-itm ${isOpen ? 'nonadmin-show' : ''}`}>
          <div className="nonadmin-sidebar-item">
            <FontAwesomeIcon icon={faHome} className="nonadmin-icons" />
            Home
          </div>
          
          <div className="nonadmin-sidebar-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} className="nonadmin-icons" />
            Logout
        </div>
        </div>
      </div>
    </>
  );
}

export default SidebarUser;
