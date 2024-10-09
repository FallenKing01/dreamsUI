import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import SidebarAdmin from '../components/sidebarAdmin';
import EmployerCreateBtn from '../components/createEmployerBtn';
import EmployerCard from '../components/employerCard';
import Spinner from '../components/spinner'; // Spinner component to indicate loading

function Employer() {
  const [employers, setEmployers] = useState([]);
  const [loader, setLoader] = useState(true);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchEmployers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {

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
        setEmployers(response.data);


      } catch (error) {
        console.error('Error fetching employers:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <div>
      {loader ? (
        <Spinner/>
      ) : (
        <div>
          <SidebarAdmin />
          <EmployerCreateBtn />

          <div>
            {employers.map((employer, index) => (
              <EmployerCard
                key={employer.id}
                id={employer.id}
                email={employer.email}
                ind={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Employer;
