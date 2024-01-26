import React, { useState } from 'react';
import axios from 'axios';
import '../css/ModalCreateEmployer.css';
import ErrorAlert from '../components/error.jsx';


const ModalCreateEmployer = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState(0);
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(-1);
  const [password2, setPassword2] = useState('');
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email);
  };

  const formValidation = async () => {
    // Your name length validation
    if (name.length < 3) {
        setVisible(1);
        await sleep(6500);
        setVisible(-1);
        return 1;
    }

    // Your email validation
    if (!isValidEmail(email) || email.length < 5) {
        setVisible(2);
        await sleep(6500);
        setVisible(-1);
        return 2;
    }
    if(password.length < 8)
    {
        setVisible(4);
        await sleep(6500);
        setVisible(-1);
        return 4;
    }

    if(password !== password2 )
    {
        setVisible(5);
        await sleep(6500);
        setVisible(-1);
        return 5;
    }

    if((!role || role.trim().toLowerCase() === 'admin' || role.length < 4))
    {
        setVisible(6);
        await sleep(6500);
        setVisible(-1);
        return 6;
    }
    if (isNaN(salary) || salary <= 0)
    {
        setVisible(7);
        await sleep(6500);
        setVisible(-1);
        return 7;
    }
    if(!birthdate)
    {
        setVisible(8);
        await sleep(6500);
        setVisible(-1);
        return 8;
    }
    if(description.length < 10)
    {
        setVisible(9);
        await sleep(6500);
        setVisible(-1);
        return 9;
    }

   
    try {
        // Axios request
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/user/getuserbyemail/${email}`);
      
        if (response.status === 200) {
            setVisible(3);
            await sleep(6500);
            setVisible(-1);
            return 3;
        }

        onClose();
    } catch (error) {
      
        setVisible(100);
    }
};




  const handleSubmit = (event) => {
    event.preventDefault();

    
    formValidation();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    const employerData = {
      name: name,
      email: email,
      password: password,
      role: role,
      salary: parseFloat(salary),
      birthdate: birthdate,
      description: description,
      userId: String(userId),
    };

    console.log(visible);
    if(visible==100)
      {
        axios.post('https://dreamsdeluxeapi.azurewebsites.net/employer/create', employerData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Success:', response.data);
          onClose();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
      }
  };

  return (
    <div>
   {visible==1 && (<ErrorAlert title='Error' message='Name must be at least 3 characters long.' onClose={() => setError(null)} />)}
   {visible==2  && (<ErrorAlert title='Error' message='Please enter a valid email address.' onClose={() => setError(null)} />)}
   {visible==3  && (<ErrorAlert title='Error' message='Email is already used' onClose={() => setError(null)} />)}
   {visible==4 && (<ErrorAlert title='Error' message='Passwords must be grater than 8 letters' onClose={() => setError(null)} />)}
   {visible==5 && (<ErrorAlert title='Error' message='Passwords do not match.' onClose={() => setError(null)} />)}
   {visible==6 && (<ErrorAlert title='Error' message='Role cannot be empty, must be different from "admin", and must be at least 4 characters long.' onClose={() => setError(null)}/>)}
   {visible==7 && (<ErrorAlert title='Error' message='Salary must be a valid number greater than 0.' onClose={() => setError(null)}/> )}
   {visible==8 && (<ErrorAlert title='Error' message='Birthdate cannot be empty.' onClose={() => setError(null)} />)}
   {visible==9 && (<ErrorAlert title='Error' message='Description cannot be empty and must be at least 10 characters long.' onClose={() => setError(null)}/>)}
   {visible==100 && (<ErrorAlert title='Error' message='NIMIC DE ZIS APASA SUBMIT' onClose={() => setError(null)}/>)}

      <form onSubmit={handleSubmit}>
        <h2 className='titleModal'>Create a new employer</h2>

        <label htmlFor='employerName' className='modalLblEmplName'>
          Employer name :
        </label>
        <br />
        <br />
        <input
          id='employerName'
          type='text'
          placeholder='Popescu Ion'
          className='modalInput'
          value={name}
          onChange={(e) => setName(e.target.value)}
          
        />

{/* Conditionally render ErrorAlert for name length validation */}

      <label htmlFor='employerEmail' className='emp-emailLbl'>
        Employer email :
      </label>
      <br />
      <br />
      <input
        id='employerEmail'
        type='text'
        placeholder='email@gmail.com'
        className='modalInput'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        
      />
      <br />
      <br />

      <label htmlFor='employerPassword' className='emp-pass'>
        Employer password :
      </label>
      <br />
      <br />
      <input
        id='employerPassword'
        type='password'
        placeholder='very strong password'
        className='modalInput'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor='employerPassword2' className='emp-pass2'>
        Repeat employer password :
      </label>
      <br />
      <br />
      <input
        id='employerPassword2'
        type='password'
        placeholder='very strong password'
        className='modalInput'
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        
      />
      <br />
      <br />

      <label htmlFor='employerRole' className='emp-role'>
        Employer role :
      </label>
      <br />
      <br />
      <input
        id='employerRole'
        type='text'
        placeholder='WAITER CHEF'
        className='modalInput'
        value={role}
        onChange={(e) => setRole(e.target.value)}
        
      />
      <br />
      <br />

      <label htmlFor='employerSalary' className='emp-salary'>
        Employer salary :
      </label>
      <br />
      <br />
      <input
        id='employerSalary'
        type='number'
        step='0.01'
        placeholder='3500'
        className='modalInput'
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
    
      />
      <br />
      <br />

      <label htmlFor='employerBirthdate' className='emp-birth'>
        Employer birthdate :
      </label>
      <br />
      <br />
      <input
  id='employerBirthdate'
  type='date'
  className='modalInput'
  value={birthdate}
  onChange={(e) => setBirthdate(e.target.value)}
  
/>
      <br />
      <br />

      <label htmlFor='employerDescription' className='emp-decription'>
        Employer description :
      </label>
      <br />
      <br />
      <textarea
  id='employerDescription'
  className='modalTextarea' // Use a specific class for styling
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  
/>

      <br />
      <br />

      
  

        <div className='emp-close' onClick={onClose}></div>
        <button type='submit' className='submit-btn submitEmpl'>
          Submit
        </button>
      </form>

      {error && <ErrorAlert title='Error' message={error} onClose={() => setError(null)} />}
    </div>
  );
};
export default ModalCreateEmployer;
