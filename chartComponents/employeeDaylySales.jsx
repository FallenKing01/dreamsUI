import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Spinner from '../components/spinner'; // Spinner component to indicate loading

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EmployeeDailySalesLineChart = ({ employeeId }) => {
  const [chartData, setChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState('Employee Daily Sales');
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch daily sales data for the employee
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employeecharts/dailymonthsales/${employeeId}`);
        
        // Access the dailySales array from the API response
        const data = response.data;

        // Validate that data exists and is an array
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No valid data found');
        }

        // Extract day and total sales (totalSum) from the response
        const labels = data.map(item => `${item.day}`);
        const totalSums = data.map(item => item.totalSum);

        // Check if all `totalSum` values are 0
        const allZero = totalSums.every(value => value === 0);

        // If all sales are zero, display "No sales" message
        if (allZero) {
          setChartTitle('No sales this month');
        } else {
          setChartTitle('Employee Daily Sales');
        }

        // Set up chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Sales (RON)',
              data: totalSums,
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Transparent line fill color
              borderColor: 'rgba(75, 192, 192, 1)', // Line color
              pointBackgroundColor: totalSums.map(value => value > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 0, 0, 1)'), // Red points for zero sales
              borderWidth: 2, // Line width
              fill: true, // Fill the area under the line
              tension: 0.5, // Smooth the line
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching the data:', error);
        setError('No sales data available');
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Total Sales (RON)',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } finally {
        await delay(1500);

        setIsLoading(false); // Stop loading spinner
        
        }
      
    };

    fetchData();
  }, [employeeId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important to allow custom sizing
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Total Sales: ${tooltipItem.raw} RON`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'white', // White grid lines
          borderColor: 'white',
        },
        ticks: {
          color: 'white', // White tick labels
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'white', // White grid lines
          borderColor: 'white',
        },
        ticks: {
          stepSize: 10, // Adjust based on your data
          color: 'white', // White tick labels
        },
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) 
    : (
        <div className='chartContainer' style={{ width: '40%', height: '300px' ,padding:'50px',margin:'1% 0 0 40%'}}> 
          <h2>{chartTitle}</h2>
          <Line data={chartData} options={options} />
        </div>
      )}
    </>
  );
};

export default EmployeeDailySalesLineChart;
