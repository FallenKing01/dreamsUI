import React from 'react';
import "../css/sidebar.css"

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function SidebarUser() {
  
    return (
      <div className="sidebar">
        <img src="../images/logo.png" alt="img" className="logo"/>
        <div className="itm">
          <div className="sidebar-item">  <FontAwesomeIcon icon={faHome} className="icons"/>Home</div>
          <div className="sidebar-item">  <FontAwesomeIcon icon={faHome} className="icons"/>Contact</div>
        </div>
      </div>
    );
  
}

export default SidebarUser;