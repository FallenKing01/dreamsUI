// CardTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/tableCard.css";
import OpenEmpl from './openEmpl';
import DeleteEmpl from './deleteEmpl';
import EditEmpl from './editEmpl';
import "../css/employerCard.css";
import PhotoIcon from '../photoModal/photoIcon';

const EmplyerCard = ({ email, counter ,ind}) => {
  const [userData, setUserData] = useState({});
  const [employerData, setEmployerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');

        // Fetch user data by email
        const userResponse = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuserbyemail/${email}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(userResponse.data);

        // Fetch employer data by user ID
        const employerResponse = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employer/getemployers/${localStorage.getItem("userId")}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setEmployerData(employerResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const marginLeft = counter * 270;

  const backgroundImageStyle = loading
    ? { backgroundImage: `url('https://dreamsblob.blob.core.windows.net/profileimages/waiters-concept-illustration_114360-2908.avif')` }
    : { backgroundImage: `url('${userData.imageUrl}')` };

  return (
    <div className="employerCardBack" style={backgroundImageStyle}>
      <EditEmpl id={employerData[ind]?.id} email={employerData[ind]?.email} name="employer" />
      <OpenEmpl id={employerData[ind]?.id} name="employer" />
      <DeleteEmpl id={employerData[ind]?.id} name="employer" />
      <PhotoIcon email={email} />
      <div className="butomCardEmpl">
        {employerData[ind]?.name}
      </div>

      {/* Display employer data */}
      <div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default EmplyerCard;
