import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import '../css/employerAbout.css';
const EmployerDataPage = () => {
  const [employer, setEmployer] = useState({});
  const { idEmployer } = useParams();
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employer/getemployer/${userId}/${idEmployer}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployer(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEmployer();
  }, [userId, idEmployer, token]);

  return (
    <div className="employer-details">
      <h2 className="employer-name">{employer.name}</h2>
      <div className="employer-info">
        <p><strong>Email:</strong> {employer.email}</p>
        <p><strong>Role:</strong> {employer.role}</p>
        <p><strong>Income:</strong> {employer.income}</p>
        <p><strong>Salary:</strong> {employer.salary}</p>
        <p><strong>Birthdate:</strong> {employer.birthdate}</p>
      </div>
    </div>
  );
};

export default EmployerDataPage;