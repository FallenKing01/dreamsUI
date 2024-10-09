import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import axios from 'axios';
import '../css/chart.css';  // Adjust the path if necessary
import Spinner from '../components/spinner';  // Spinner component to indicate loading

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const DailySales = ({ adminId, onLoadComplete }) => {
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [isLoading, setIsLoading] = useState(true); // State to manage loading spinner
  const [chartTitle, setChartTitle] = useState('Daily Sales for Current Month');
  adminId=localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/charts/dailysalescurentmonth/${adminId}`);
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data available');
        }

        // Extracting days and sales sums for the chart
        const days = data.map(item => item.day);
        const sales = data.map(item => item.totalSum);

        // Find indices of the top 3 highest values
        const topIndices = sales
          .map((value, index) => ({ value, index }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(item => item.index);

        // Find indices of the worst 3 lowest values
        const worstIndices = sales
          .map((value, index) => ({ value, index }))
          .sort((a, b) => a.value - b.value)
          .slice(0, 3)
          .map(item => item.index);

        // Separate data into three datasets: top 3, worst 3, and the rest
        const topSalesData = sales.map((value, index) => topIndices.includes(index) ? value : null);
        const worstSalesData = sales.map((value, index) => worstIndices.includes(index) ? value : null);
        const restSalesData = sales.map((value, index) => !topIndices.includes(index) && !worstIndices.includes(index) ? value : null);

        // Colors
        const topPointColor = 'rgba(0, 255, 0, 1)'; // Green for top 3
        const worstPointColor = 'rgba(255, 0, 0, 1)'; // Solid red for worst 3
        const restPointColor = 'rgba(75, 192, 192, 1)'; // Blue for the rest

        // Setting up the chart data
        setChartData({
          labels: days,
          datasets: [
            {
              label: 'Top 3 Sales (RON)',
              data: topSalesData,
              borderColor: topPointColor,
              backgroundColor: 'rgba(0, 255, 0, 0.5)', // Light green for top 3
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: topSalesData.map(value => value !== null ? topPointColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
            {
              label: 'Worst 3 Sales (RON)',
              data: worstSalesData,
              borderColor: worstPointColor,
              backgroundColor: 'rgba(255, 0, 0, 0.5)', // Light red for worst 3
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: worstSalesData.map(value => value !== null ? worstPointColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
            {
              label: 'Other Sales (RON)',
              data: restSalesData,
              borderColor: restPointColor,
              backgroundColor: 'rgba(75, 192, 192, 0.5)', // Light blue for the rest
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: restSalesData.map(value => value !== null ? restPointColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
          ],
        });

        setErrorMessage(''); // Clear any error message
        setChartTitle('Daily Sales for Current Month'); // Set chart title
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('No data available.');
        setChartTitle('No sales data');
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Top 3 Sales (RON)',
              data: [],
              borderColor: 'rgba(0, 255, 0, 1)',
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Worst 3 Sales (RON)',
              data: [],
              borderColor: 'rgba(255, 0, 0, 1)',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Other Sales (RON)',
              data: [],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              fill: true,
              borderWidth: 2,
            },
          ],
        });
      } finally {
        setIsLoading(false); // Stop loading spinner
        if (onLoadComplete) {
          onLoadComplete(); // Ensure onLoadComplete is called after loading
        }
      }
    };

    fetchData();
  }, [adminId, onLoadComplete]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Sales: ${tooltipItem.raw} RON`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light grid lines color
          borderColor: 'rgba(255, 255, 255, 0.7)', // White border color for the x-axis
        },
        ticks: {
          color: 'white', // Set the tick labels color to white
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light grid lines color
          borderColor: 'rgba(255, 255, 255, 0.7)', // White border color for the y-axis
        },
        ticks: {
          callback: function (value) {
            return `${value} RON`; // Display the y-axis labels with "RON"
          },
          color: 'white', // Set the tick labels color to white
        },
      },
    },
    animation: {
      duration: 1500,  // Set the duration of animations in milliseconds (1500ms = 1.5 seconds)
      easing: 'easeInOutQuad',  // Use a smoother easing function
    },
  };

  return (
    <>
      {isLoading ? (
        <Spinner /> // Display spinner while loading
      ) : (
        <div className='chartContainer'>
          <h2>{chartTitle}</h2>
          {errorMessage ? (
            <p>{errorMessage}</p> // Display error message if there's any
          ) : (
            <Line data={chartData} options={options} /> // Render chart if data is available
          )}
        </div>
      )}
    </>
  );
};

export default DailySales;
