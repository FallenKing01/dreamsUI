import React, { useState, useEffect } from 'react';
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import axios from 'axios';
import '../userPageCss/profilePage.css';
import { ColorRing } from 'react-loader-spinner';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

const UserProfile = () => {
    const [userName, setUserName] = useState('');
    const userId = localStorage.getItem('userId');
    const [loader, setLoader] = useState(true);
    const [judete, setJudete] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedJudet, setSelectedJudet] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

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

    const formatResult = (item) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
            <span style={{ fontSize: '14px' }}>{item.name}</span>
        </div>
    );

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

                <div style={{ position: 'relative' , width: '50%', margin: 'auto' }}>
                    <label htmlFor="">County </label>
                    <ReactSearchAutocomplete
                        items={judete}
                        onSearch={(string, results) => console.log(string, results)}
                        onHover={(result) => console.log(result)}
                        onSelect={handleOnSelectJudet}
                        onFocus={() => console.log('Focused')}
                        autoFocus
                        formatResult={formatResult}
                        placeholder="Select a county..."
                        defaultValue={selectedJudet?.name || ''}
                        styling={{
                            zIndex: 10,
                            position: 'absolute',
                            backgroundColor: 'white',
                        }}
                    />
                </div>

                <br />

                <div style={{ position: 'relative', width:"50%", margin:"auto" }}>
                    <label htmlFor="">City </label>
                    <ReactSearchAutocomplete
                        items={cities}
                        onSearch={(string, results) => console.log(string, results)}
                        onHover={(result) => console.log(result)}
                        onSelect={handleOnSelectCity}
                        onFocus={() => console.log('Focused')}
                        autoFocus
                        formatResult={formatResult}
                        placeholder="Select a city..."
                        defaultValue={selectedCity?.name || ''}
                        styling={{
                            zIndex: 9,
                            position: 'absolute',
                            backgroundColor: 'white',
                        }}
                    />
                </div>

                <UserNavBar />
            </div>

        </>
    );
};

export default UserProfile;
