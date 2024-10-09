import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import LoginPage from '../pages/login';
import Home from '../pages/home';
import Bill from '../pages/bill';  
import Employer from '../pages/employers';
import EmployerDataPage from '../components/employerDataPage';
import Menu from '../pages/menu';
import TableMap from '../pages/tableMap';
import ChartPage from '../pages/chartPage';
import UserMainPage from '../userPage/userMainPage';
import ProductList from '../userPage/viewRestarantMenu';
import ReviewsComponent from '../userPage/reviewsPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/table/:id" element={<Bill />} />

          <Route path="/restaurantmenu/:restaurantId" element={<ProductList />} />
          <Route path="/reviews/:restaurantId" element={<ReviewsComponent />} />



          <Route path="/employer" element={<Employer />} />
          <Route path="/employer/:idEmployer" element={<EmployerDataPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tablemap" element={<TableMap />} />
          <Route path="/charts" element={<ChartPage />} />
          <Route path="/user" element={<UserMainPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;