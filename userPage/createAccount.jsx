import React, { useState } from 'react';
import axios from 'axios';
import '../userPageCss/createAcc.css';
import Alert from '../components/alert';
import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        username: '',
        password: '',
        county: 'Suceava',
        location: 'Solca',
        phoneNumber: '',
    });

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false); // Spinner state
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show spinner
        try {
            const response = await axios.post('https://dreamsdeluxeapi.azurewebsites.net/client/create', formData);
            console.log(response.data);
            navigate('/login'); // Navigate after success
        } catch (error) {
            if (error.response?.status === 409) {
                setError(true);
            }
            console.error('Error creating account:', error);
        } finally {
            setLoading(false); // Hide spinner after operation
        }
    };

    const handleRedirectToLogin = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/login');
        }, 1000); // Simulate transition delay
    };

    return (
        <>
            {loading && <Spinner />} {/* Show spinner when loading */}
            {error && <Alert message="Username already exists" />}
            {!loading && (
                <div className="create-acc-page-container">
                    <div className="create-acc-page-form-wrapper">
                        <h1>Create account</h1>
                        <form onSubmit={handleSubmit} className="create-acc-page-form">
                            <div className="create-acc-page-field">
                                <label className="label-create-acc" htmlFor="clientName">Client name:</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="create-acc-page-field">
                                <label className="label-create-acc" htmlFor="username">Email:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="create-acc-page-field">
                                <label className="label-create-acc" htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="create-acc-page-field">
                                <label htmlFor="phoneNumber" className="label-create-acc">Phone number:</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div 
                                className="redirect-login"
                                onClick={handleRedirectToLogin}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Have an account?
                            </div>

                            <button type="submit" className="create-acc-page-submit">Create account</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateAccount;
