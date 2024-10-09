import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../css/monthlySales.css';  // Ensure correct path
import Spinner from '../components/spinner'; // Spinner component to indicate loading

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlySalesLineChart = ({ adminId, onLoadComplete }) => {
  const [chartData, setChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState('Monthly Sales');
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  adminId=localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/charts/monthlysales/${adminId}`);
        const data = response.data.monthlySales;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data available');
        }

        // Map the data to chart format
        const labels = data.map(item => {
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          return monthNames[item.month - 1]; // Convert month number to month name
        });

        const totalSums = data.map(item => item.totalSum);

        // Find indices of the top 3 highest values
        const topIndices = totalSums
          .map((value, index) => ({ value, index }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(item => item.index);

        // Find indices of the worst 3 lowest values
        const worstIndices = totalSums
          .map((value, index) => ({ value, index }))
          .sort((a, b) => a.value - b.value)
          .slice(0, 3)
          .map(item => item.index);

        // Separate data into datasets for top 3, worst 3, and the rest
        const topSalesData = totalSums.map((value, index) => topIndices.includes(index) ? value : null);
        const worstSalesData = totalSums.map((value, index) => worstIndices.includes(index) ? value : null);
        const restSalesData = totalSums.map((value, index) => !topIndices.includes(index) && !worstIndices.includes(index) ? value : null);

        // Colors
        const topColor = 'rgba(0, 255, 0, 1)'; // Green for top 3
        const worstColor = 'rgba(255, 0, 0, 1)'; // Solid red for worst 3
        const restColor = 'rgba(75, 192, 192, 1)'; // Blue for the rest

        // Set up chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Top 3 Sales (RON)',
              data: topSalesData,
              borderColor: topColor,
              backgroundColor: 'rgba(0, 255, 0, 0.5)', // Light green for top 3
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: topSalesData.map(value => value !== null ? topColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
            {
              label: 'Worst 3 Sales (RON)',
              data: worstSalesData,
              borderColor: worstColor,
              backgroundColor: 'rgba(255, 0, 0, 0.5)', // Light red for worst 3
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: worstSalesData.map(value => value !== null ? worstColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
            {
              label: 'Other Sales (RON)',
              data: restSalesData,
              borderColor: restColor,
              backgroundColor: 'rgba(75, 192, 192, 0.5)', // Light blue for the rest
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: restSalesData.map(value => value !== null ? restColor : 'rgba(0,0,0,0)'),
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              hidden: false, // Initially visible
            },
          ],
        });

        setChartTitle('Monthly Sales'); // Set chart title on successful data fetch
      } catch (error) {
        console.error('Error fetching the data', error);
        setChartTitle('No sales this year');
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
          onLoadComplete('monthlySalesChart'); // Call the onLoadComplete function with an identifier
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
          stepSize: 1000, // Adjust based on your data
          color: 'white', // White tick labels
        },
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='chartContainer'>
          <h2>{chartTitle}</h2>
          <Line data={chartData} options={options} />
        </div>
      )}
    </>
  );
};

export default MonthlySalesLineChart;
