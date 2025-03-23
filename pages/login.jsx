import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../components/alert";
import { ColorRing } from "react-loader-spinner";
import "../css/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setShowAlert(false);

    if (!username || !password) {
      setShowAlert(true);
      setAlertMessage("Please enter all the fields");
      return;
    }

    if (!emailRegex.test(username)) {
      setShowAlert(true);
      setAlertMessage("Please enter a valid email address");
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(
        "https://dreamsdeluxeapi.azurewebsites.net/login/",
        { username, password }
      );
      const token = response.data["Authentication successful"];
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        setShowAlert(true);
        setAlertMessage("Invalid username or password");
      } else if (error.response?.status === 404) {
        setShowAlert(true);
        setAlertMessage("User not found");
      } else {
        setShowAlert(true);
        setAlertMessage("An error occurred during login");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      navigate("/forgotpassword");
    }, 300);
  };

  return (
    <div className="login-page">
      {loader && (
        <div className="loader-overlay">
          <ColorRing />
          <p>Loading...</p>
        </div>
      )}

      {showAlert && <Alert message={alertMessage} onClose={() => setShowAlert(false)} />}

      <div className="login-container">
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="forgot-link">
          <a href="/forgotpassword" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
        <button onClick={handleLogin} className="login-btn">
          Login
        </button>
      </div>
    </div>
  );
}
