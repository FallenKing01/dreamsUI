import React from 'react';
import MyDatePicker from '../components/datePicker'; // Adjust the path based on your file structure
import ProductChart from '../chartComponents/productChart'; // Adjust the path based on your file structure
import SidebarAdmin from '../components/sidebarAdmin';
import MonthlySalesChart from '../chartComponents/monthlySales';
import DailySales from '../chartComponents/dailySales'; // Import the new DailySales component
import CurrentMonthChart from '../chartComponents/bestProductsMonthly'; // Import the new CurrentMonthChart component
function ChartPage() {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarAdmin />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ flex: '1', marginRight: '10px' }}>
            <ProductChart adminId={localStorage.getItem("adminId")} />
          </div>
          <div style={{ flex: '1', marginLeft: '10px' }}>
            <CurrentMonthChart adminId={localStorage.getItem("adminId")} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ flex: '1', marginRight: '10px' }}>
            <DailySales adminId={localStorage.getItem("adminId")} />
          </div>
          <div style={{ flex: '1', marginLeft: '10px' }}>
            <MonthlySalesChart adminId={localStorage.getItem("adminId")} />
          </div>
        </div>
      </div>
    </div>
  );
}


export default ChartPage;
