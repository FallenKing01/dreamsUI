import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import LoginPage from '../pages/login';
import Home from '../pages/home';
import Bill from '../pages/bill';  
import Employer from '../pages/employers';
import EmployerDataPage from '../components/employerDataPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/table/:id" element={<Bill />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/employer/:idEmployer" element={<EmployerDataPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;