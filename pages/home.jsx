import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import SidebarUser from '../components/sidebarUser';
import SidebarAdmin from '../components/sidebarAdmin';
import CreateBtn from '../components/createTable';
import CardTable from '../components/tableComponent';
import { ColorRing } from 'react-loader-spinner';
import TableMap from '../components/tableMapView';
import { Navigate } from "react-router-dom";

function Home() {
  const [tokenExipired, setTokenExpired] = useState(false);
  const [tables, setTables] = useState([]);
  const [loader, setLoader] = useState(true);
  const [userRole, setUserRole] = useState("");

  const isTokenExpired = (decoded) => {
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Current Time:", currentTime);
    console.log("Token Expiry Time:", decoded.exp);
    return decoded.exp < currentTime;
  };
 
  

  useEffect(() => {
    const fetchTables = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
      
        if (isTokenExpired(decoded)) {
          console.error('Token has expired');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          
          setTokenExpired(true);
        }
        const userId = String(decoded.id);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', decoded.username);
        try {
          if (decoded.role === 'admin') {
            setUserRole(decoded.role);
            localStorage.setItem('adminId', userId);
           
            const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettables/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setTables(response.data);
          } 
          if(decoded.role=='client')
          {
            setUserRole(decoded.role);
            const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuserbyemail/${localStorage.getItem('email')}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('location', response.data.location);
            localStorage.setItem('county', response.data.county);
            } 
          if(decoded.role !='client' && decoded.role !='admin') 
          {
            setUserRole(decoded.role);
            let adminId = null;
            localStorage.setItem('adminId', adminId);
            const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuseradmin/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            adminId = response.data.id;
            localStorage.setItem('adminId', adminId);
            const responseAdmin = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettables/${adminId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setTables(responseAdmin.data);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoader(false);
        }
      } else {
        console.error('Token not found in local storage');
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    // Disable scrolling when loader is displayed
    if (loader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [loader]);

  return (
    <>
      {loader && (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ColorRing />
            <div style={{ color: 'white', fontSize: '20px', marginTop: '10px', marginLeft: '5px' }}>Loading...</div>
          </div>
        </div>
      )} 
    {userRole === 'client' && !loader && <Navigate to="/user" />}
      {!loader && (
        <div>
          <TableMap adminId={localStorage.getItem('adminId')} />
          {userRole === 'admin' ? <SidebarAdmin /> : <SidebarUser />}
          <CreateBtn />
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tables.map((table, index) => (
              <CardTable key={table.id} name={table.name} id={table.id} counter={index + 1} />
            ))}
          </div>
        </div>
      )}
      {tokenExipired && <Navigate to="/login" />}
    </>
  );
}

export default Home;
