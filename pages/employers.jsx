import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import SidebarAdmin from '../components/sidebarAdmin';
import EmployerCreateBtn from '../components/createEmployerBtn';
import EmployerCard from '../components/employerCard';

function Employer() {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    const fetchEmployers = async () => {
      const token = localStorage.getItem('token');
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
        console.error('Error:', error);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <div>
      <SidebarAdmin/>
      <EmployerCreateBtn />
      {employers.map((employer, index) => (
  <EmployerCard key={employer.id} id={employer.id} email={employer.email} ind={index} />
))}
    </div>
  );
}

export default Employer;