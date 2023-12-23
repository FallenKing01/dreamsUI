import React, { useState } from 'react';
import axios from 'axios';
import "../css/ModalCreateEmployer.css";

const ModalCreateEmployer = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState(0);
  const [birthdate, setBirthdate] = useState("");
  const [description, setDescription] = useState("");
 
  
const handleSubmit = (event) => {
  event.preventDefault();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token'); // Get the token from local storage

  const employerData = {
    name: name,
    email: email,
    password: password,
    role:role,
    salary: parseFloat(salary),
    birthdate: birthdate,
    description: description,
    userId: String(userId)
  };

  console.log('Form data:', employerData);

  axios.post('https://dreamsdeluxeapi.azurewebsites.net/employer/create', employerData, {
    headers: {
      'Authorization': `Bearer ${token}` // Include the token in the Authorization header
    }
  })
  .then(response => {
    console.log('Success:', response.data);
    onClose();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};
  
  return (

    
    <form  onSubmit={handleSubmit}>
          
      
      <h2 className='titleModal'>Create a new employer</h2>

      {/*     !!!!!!!!!!!!          NAME INPUT          !!!!!!!!!!!!!!!!!!                     */}
      <label htmlFor="employerName" className='modalLbl'>Employer name : </label>
      <br />
      <br />
      <input 
        id="employerName"
        type="text" 
        placeholder='Popescu Ion' 
        className="modalInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <label htmlFor="employerEmail" className='emp-emailLbl'>Employer email : </label>

      {/*                       EMAIL INPUT                     */}

      <br />
      <br />  

      <input 
        id="employerEmail"
        type="text" 
        placeholder='email@gmail.com' 
        className="modalInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <br /> 
    {/*           !!!!!!!!!!!!!!!!!            PASSWORD     INPUT             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!        */}

      <label htmlFor="employerPassword" className='emp-pass'>Employer password : </label>
      <br />
      <br />  
      <input 
        id="employerPassword"
        type="password" 
        placeholder='very strong password' 
        className="modalInput"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <br /> 
      
    {/*           !!!!!!!!!!!!!!!!!            ROLE     INPUT             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!        */}

    <label htmlFor="employerRole" className='emp-role'>Employer role : </label>      <br />
      <br />  
      <input 
        id="employerRole"
        type="text" 
        placeholder='WAITER CHEF' 
        className="modalInput"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <br />
      <br /> 

    {/*           !!!!!!!!!!!!!!!!!            SALARY     INPUT             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!        */}


      <label htmlFor="employerSalary" className='emp-salary'>Employer salary : </label>
      <br />
      <br />  
      <input 
        id="employerSalary"
        type="number" 
        step="0.01"
        placeholder='3500' 
        className="modalInput"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        required
      />
      <br />
      <br /> 


    {/*           !!!!!!!!!!!!!!!!!            BIRTHDATE     INPUT             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!        */}
    <label htmlFor="employerBirthdate" className='emp-birth'>Employer birthdate : </label>
        <br />
        <br />
        <input
          id="employerBirthdate"
          type="string"
          className="modalInput"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <br />
        <br />
    {/*           !!!!!!!!!!!!!!!!!            DESCRIPTION     INPUT             !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!        */}
    <label htmlFor="employerDescription" className='emp-decription'>Employer description : </label>
        <br />
        <br />
        <input
          id="employerDescription"
          type="string"
          className="modalInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <br />

        <div className="emp-close" onClick={onClose}></div>
        <button type="submit" className='submit-btn submitEmpl'>Submit</button>
    </form>
  );
};

export default ModalCreateEmployer;
