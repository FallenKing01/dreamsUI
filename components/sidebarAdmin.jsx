import React from 'react';
import "../css/sidebar.css"

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import {faBowlFood} from "@fortawesome/free-solid-svg-icons";
import {faPhoneAlt} from "@fortawesome/free-solid-svg-icons";
import {faMap} from "@fortawesome/free-solid-svg-icons";
import {faChartSimple} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function SidebarAdmin() {
  
    return (
      <div className="sidebar">
        <img src="../images/logo.png" alt="img" className="logo"/>
        <div className="itm">
          <div className="sidebar-item">  <FontAwesomeIcon icon={faHome} className="icons"/><a href="/" className='sidebar-item'> Home</a></div>
          <div className="sidebar-item">  <FontAwesomeIcon icon={faPeopleGroup} className="icons" /><a href="/employer" className='sidebar-item'>Employers</a></div>
          <div className="sidebar-item">  <FontAwesomeIcon icon={faBowlFood} className="icons"/><a href="/menu" className='sidebar-item'>Menu</a></div>
          <div className="sidebar-item">  <FontAwesomeIcon icon={faPhoneAlt} className="icons"/><a href="/contact" className='sidebar-item'>Contact</a></div>
          <div className="sidebar-item"> <FontAwesomeIcon icon={faMap} className='icons'/><a href='/tablemap' className='sidebar-item'>Table map</a> </div>
          <div className="sidebar-item"> <FontAwesomeIcon icon={faChartSimple} className='icons' /><a href='/charts' className='sidebar-item'>Charts</a> </div>
        </div>
      </div>
    );
  
}

export default SidebarAdmin;