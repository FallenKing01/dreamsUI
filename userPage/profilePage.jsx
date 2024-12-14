import React, { useState, useEffect } from 'react';
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import axios from 'axios';
import '../userPageCss/profilePage.css';

const UserProfile = () => {
    const [userName, setUserName] = useState(''); // State to store the user's name
    const userId = localStorage.getItem('userId'); // Fetch userId from local storage

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/client/getclient/${userId}`);
                setUserName(response.data.name); // Update the state with the user's name
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]); // Dependency array ensures fetchUser runs when userId changes

    return (


        <div className="user-profile">
            <h3 className='profile-title'>Buna ziua , {userName || 'Loading...'} !</h3>

            



            <UserNavBar />

        </div>


    );
};

export default UserProfile;
