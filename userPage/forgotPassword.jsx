import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../userPageCss/forgotPassword.css';
import axios from 'axios';
import Spinner from '../components/spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/login/forgotpasswordsendemail/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Adding slight delay to show spinner clearly (optional)
            setTimeout(() => {
                navigate('/change-password', { state: { email: email, response: data } });
            }, 500);

        } catch (error) {
            console.error('Error sending forgot password email:', error);
            setLoading(false); // Stop loading if there's an error
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <h2 className='forgotPassword-title'>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="forgot-password-form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="forgot-password-submit-btn">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
