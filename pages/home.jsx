import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import SidebarUser from '../components/sidebarUser';
import SidebarAdmin from '../components/sidebarAdmin';
import CreateBtn from '../components/createTable';
import CardTable from '../components/tableComponent';

function Home() {
  const [tables, setTables] = useState([]);
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const fetchTables = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        const decoded = jwtDecode(token);
        const userId = String(decoded.id);
        localStorage.setItem('userId', userId);


        if (decoded.role === 'admin') 
        {
            try 
            {
            
                    setUserRole(decoded.role);
                    const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettables/${userId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    setTables(response.data);
                    console.log(response.data);
              } 
            catch (error) {
              console.error('Error:', error);
            }
      }
      else
      {
        try 
            {
            
                    setUserRole(decoded.role);
                    let adminId=null;
                    const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuseradmin/${userId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    adminId=response.data.id;
                    const responseAdmin = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/tables/gettables/${adminId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    setTables(responseAdmin.data);
                    console.log(response.data);
              } 
            catch (error) {
              console.error('Error:', error);
            }
      } 
      }
      else {
        console.error('Token not found in local storage');
      }
    };

    fetchTables();
  }, []);

  return (
    
    <div>
      {userRole === 'admin' ? <SidebarAdmin />:<SidebarUser /> }
      <CreateBtn />

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {tables.map((table, index) => (
          <CardTable key={table.id} name={table.name} id={table.id} counter={index + 1} />
        ))}
      </div>
    </div>
  );
}

export default Home;
