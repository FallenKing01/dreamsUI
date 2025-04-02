import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import axios from 'axios';
import '../userPageCss/profilePage.css';
import { ColorRing } from 'react-loader-spinner';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Spinner from '../components/spinner'; 

const UserProfile = () => {
    const [userName, setUserName] = useState('');
    const userId = localStorage.getItem('userId');
    const [loader, setLoader] = useState(true);
    const [judete, setJudete] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedJudet, setSelectedJudet] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [redirecting, setRedirecting] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/client/getclient/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoader(false);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchJudete = async () => {
            try {
                const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/region/judete`);
                if (Array.isArray(response.data)) {
                    const formattedData = response.data.map((item, index) => ({
                        id: index,
                        name: item,
                    }));
                    setJudete(formattedData);

                    if (formattedData.length > 0) {
                        setSelectedJudet(formattedData[0]);
                        fetchCities(formattedData[0].name);
                    }
                }
            } catch (error) {
                console.error('Error fetching counties:', error);
            }
        };
        fetchJudete();
    }, []);

    const fetchCities = async (judet) => {
        if (!judet) return;
        try {
            const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/region/orase/${judet}`);
            if (Array.isArray(response.data)) {
                const formattedCities = response.data.map((item, index) => ({
                    id: index,
                    name: item.name,
                }));
                setCities(formattedCities);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCities([]);
        }
    };

    const handleOnSelectJudet = (item) => {
        setSelectedJudet(item);
        fetchCities(item.name);
    };

    const handleOnSelectCity = (item) => {
        setSelectedCity(item);
    };

    const handleUpdateLocation = async () => {
        if (!selectedJudet || !selectedCity) {
            setMessage('Please select both a county and a city.');
            return;
        }

        setUpdating(true);
        setMessage('');

        try {
            const response = await axios.put('https://dreamsdeluxeapi.azurewebsites.net/client/updateclientlocation', {
                clientId: userId,
                location: selectedCity.name,
                county: selectedJudet.name,
            });

            if (response.status === 200) {
                setMessage('Location updated successfully!');
                setRedirecting(true);
                setTimeout(() => {
                    navigate("/user");
                }, 2000);
            } else {
                setMessage('Failed to update location.');
            }
        } catch (error) {
            console.error('Error updating location:', error);
            setMessage('Error updating location. Please try again.');
        } finally {
            localStorage.setItem('location', selectedCity.name);
            localStorage.setItem('county', selectedJudet.name);
            setUpdating(false);
        }
    };

    return (
        <>
            {loader && (
                <div className="loader-overlay">
                    <div className="loader-content">
                        <ColorRing />
                        <div className="loader-text">Loading...</div>
                    </div>
                </div>
            )}

            <div className="user-profile" style={loader ? { pointerEvents: 'none' } : {}}>
                <h3 className="profile-title">Hello, {userName || 'Loading...'} !</h3>

                <div style={{ position: 'relative', width: '50%', margin: 'auto' ,zIndex: 1}}>
                    <label htmlFor="">Location </label>
                    <label htmlFor="">County </label>
                    <ReactSearchAutocomplete  items={judete} onSelect={handleOnSelectJudet} placeholder="Select a county..." />
                </div>

                <br />

                <div style={{ position: 'relative', width: "50%", margin: "auto" }}>
                    <label htmlFor="">City </label>
                    <ReactSearchAutocomplete items={cities} onSelect={handleOnSelectCity} placeholder="Select a city..." />
                </div>

                <br />

                <div className="update-location-container">
                    {redirecting ? (
                        <div className="redirect-spinner">
                            <Spinner />
                            <p>Redirecting...</p>
                        </div>
                    ) : (
                        <button className="update-location-btn" onClick={handleUpdateLocation} disabled={updating}>
                            {updating ? 'Updating...' : 'Update location'}
                        </button>
                    )}
                    {message && <p className="update-message">{message}</p>}
                </div>

                <UserNavBar />
            </div>
        </>
    );
};

export default UserProfile;