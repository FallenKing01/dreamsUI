import { useState } from "react";
import axios from "axios";
import "../css/login.css";
import Alert from "../components/alert";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const handleLogin = async () => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      const response = await axios.post(
        "https://dreamsdeluxeapi.azurewebsites.net/login/",
        {
          username: username,
          password: password,
        }
      );
  
     
      const token = response.data["Authentication successful"];
  
      localStorage.setItem("token", token);
      setShowAlert(false);
      console.log("Login successful!");
    } catch (error) {
      if(error.response.status === 401){
        setShowAlert(true);
        setAlertMessage("Invalid username or password");
      }

      if(error.response.status === 404){
        setShowAlert(true);
        setAlertMessage("User not found");
      }
      console.error("Error:", error.message);
     
    }
  };

  return (
    <div>
      {showAlert && <Alert message={alertMessage} />}
      <img src=".//images/bar.avif" alt="" />
      <div className="lg-back">
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
    </div>
  );
}