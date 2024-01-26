import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

    // Close the alert before making the API call
    setShowAlert(false);

    if (username === "" || password === "") {
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
        {
          username: username,
          password: password,
        }
      );

      const token = response.data["Authentication successful"];

      localStorage.setItem("token", token);
      console.log("Login successful!");

      // Redirect to / after successful login
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
        setAlertMessage("Invalid username or password");
      } else if (error.response && error.response.status === 404) {
        setShowAlert(true);
        setAlertMessage("User not found");
      } else {
        setShowAlert(true);
        setAlertMessage("An error occurred during login");
        console.error("Error:", error.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const blackBackgroundStyle = {
    backgroundColor: loader ? "black" : "transparent",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: loader ? 1 : "auto",
  };

  return (
    <div style={blackBackgroundStyle}>
      {loader && <ColorRing />} {/* Render the spinner conditionally */}
      {showAlert && <Alert message={alertMessage} onClose={handleAlertClose} />}
      <img src=".//images/bar.avif" alt="" />
      {!loader && (
        <div className={`lg-back ${loader ? 'transparent' : ''}`}>
          <label htmlFor="" className="username-lbl">
            Username
          </label>
          <input
            type="text"
            className="username-inp1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="" className="password-lbl">
            Password
          </label>
          <input
            type="password"
            className="password-inp2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <div className="forgot">Forgot password</div>
          <input type="checkbox" className="check" />
          <button className="submit-login-btn" onClick={handleLogin}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}