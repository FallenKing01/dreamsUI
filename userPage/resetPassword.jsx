import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../userPageCss/forgotPassword.css';
import axios from 'axios';
import Spinner from '../components/spinner';

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const [tokenExists, setTokenExists] = useState(true);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setTokenExists(false);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `https://dreamsdeluxeapi.azurewebsites.net/login/resetpassword/${email}/${newPassword}/${code}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setFeedback('Password changed successfully!');
            // Add short delay to show spinner before redirect
            setTimeout(() => navigate('/login'), 1000);

        } catch (error) {
            setLoading(false);
            if (error.response) {
                const backendMessage = error.response.data.message;

                if (backendMessage === 'Wrong code') {
                    setFeedback('The code you entered is incorrect.');
                } else {
                    setFeedback(`Error: ${backendMessage}`);
                }
            } else {
                setFeedback('An unexpected error occurred.');
            }
        }
    };

    if (!tokenExists) {
        return (
            <div className="forgot-password-wrapper">
                <div className="forgot-password-container">
                    <h2 className="forgotPassword-title">Unauthorized</h2>
                    <p>No token found. Please log in again.</p>
                    <button onClick={() => navigate('/login')} className="forgot-password-submit-btn">Go to Login</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <h2 className="forgotPassword-title">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="forgot-password-form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email || ''}
                            readOnly
                        />
                    </div>
                    <div className="forgot-password-form-group">
                        <label htmlFor="code">Code:</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="forgot-password-form-group">
                        <label htmlFor="new-password">New Password:</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="forgot-password-submit-btn">Change Password</button>
                </form>
                {feedback && <p style={{ marginTop: '10px', color: 'red' }}>{feedback}</p>}
            </div>
        </div>
    );
};

export default ChangePassword;
