import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import SidebarAdmin from '../components/sidebarAdmin';
import EmployerCreateBtn from '../components/createEmployerBtn';
import EmployerCard from '../components/employerCard';
import { ColorRing } from 'react-loader-spinner';

function Employer() {
  const [employers, setEmployers] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchEmployers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // Handle the case where the token is missing (e.g., redirect to login)
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employer/getemployers/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Employers:', response.data);
        setEmployers(response.data);
      } catch (error) {
        console.error('Error fetching employers:', error);
        // Display an error message to the user or handle the error appropriately
      } finally {
        // Set loader to false immediately after the data has been loaded
        setLoader(false);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <div>
      {
        loader==0 && (
        <div>
          <SidebarAdmin />
          <EmployerCreateBtn />

          {employers.map((employer, index) => (
            <EmployerCard
            key={employer.id}
            id={employer.id}
            email={employer.email}
            ind={index}
            // Pass a prop to indicate whether the image is loaded
            imageLoaded={!loader}
        />
        ))}
        </div>
        )
        
      }
      

     

      {loader==1 && (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ColorRing />
            <div style={{ color: 'white', fontSize: '20px', marginTop: '10px', marginLeft: '5px' }}>Loading...</div>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Employer;
