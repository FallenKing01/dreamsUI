import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import EmployeeDailySalesLineChart from '../chartComponents/employeeDaylySales';
import MonthlySalesLineChart from '../chartComponents/monthlyEmployeeIncome';
import '../css/employerAbout.css';
import Spinner from './spinner';

const EmployerDataPage = () => {
  const [employer, setEmployer] = useState({});
  const [employeeAccId, setEmployeeAccId] = useState(null); // Use state for employeeAccId
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { idEmployer } = useParams();
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const [loadingCharts, setLoadingCharts] = useState({
    chart1: true,
    chart2: true,
  });

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employer/getemployer/${userId}/${idEmployer}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
    
        });
        

        setEmployer(response.data);
        setEmail(response.data.email); // Update email state with the fetched employer's email
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };

    fetchEmployer();
  }, [userId, idEmployer, token]);

  // Second useEffect to fetch the employee ID based on the email once it's set
  useEffect(() => {
    if (email) {  // Only make the request if the email is not empty
      const fetchEmployeeId = async () => {
        try {
          const employeeIdResponse = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuserbyemail/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEmployeeAccId(employeeIdResponse.data._id.toString()); // Set employeeAccId in state
          setImageUrl(employeeIdResponse.data.imageUrl);
        } catch (error) {
          console.error('Error fetching employee ID:', error);
        }
      };

      fetchEmployeeId();
    }
  }, [email, token]); 



  return (
    <>

      
       
        <div>
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
    

        <img
        src={imageUrl}
        alt="Employee image"
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          objectFit: 'cover',
          position: 'absolute', // Ensure the image scrolls with the content
          margin:'3% 0px 0px 6%',
        }}
      />
     
    
    <div>
        <EmployeeDailySalesLineChart employeeId={employeeAccId} />
        <MonthlySalesLineChart employeeId={employeeAccId}  />
    </div>
    </div>
      
      
    
    </>
  );
};

export default EmployerDataPage;
