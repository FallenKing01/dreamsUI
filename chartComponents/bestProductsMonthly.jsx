import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../css/chart.css';  // Adjust the path if necessary
import Spinner from '../components/spinner';  // Spinner component to indicate loading

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CurrentMonthChart = ({ adminId, onLoadComplete }) => {
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');  // State for error messages
  const [isLoading, setIsLoading] = useState(true);  // State to manage loading spinner
  const [chartTitle, setChartTitle] = useState('Most Sold Products in Current Month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/charts/currentmonthchart/${adminId}`);
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data available');
        }

        // Extracting labels and data for the chart
        const labels = data.map(item => item.productDetails[0]?.name || 'Unknown Product');
        const quantities = data.map(item => item.qtySum || 0);
        const prices = data.map(item => item.productDetails[0]?.price || 0);
        const types = data.map(item => item.productDetails[0]?.type || 'Unknown Type');

        // Define different colors for each bar
        const colors = [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(54, 162, 235, 1)', // Blue
          'rgba(255, 206, 86, 1)', // Yellow
          'rgba(75, 192, 192, 1)', // Green
          'rgba(153, 102, 255, 1)', // Purple
     
        ];

        // Limit colors to the number of items
        const barColors = colors.slice(0, labels.length);

        // Setting up the chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Quantity Sold',
              data: quantities,
              backgroundColor: barColors, // Apply different colors to each bar
              borderColor: barColors.map(color => color.replace('0.2', '1')), // Make border colors solid
              borderWidth: 1,
            },
          ],
          prices: prices,  // Save prices
          types: types,    // Save types
        });

        setErrorMessage('');  // Clear any error message
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('No data available.');
        setChartTitle('No Sales This Month');
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Quantity Sold',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color for no data
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } finally {
        setIsLoading(false);  // Stop loading spinner
        if (onLoadComplete) {
          onLoadComplete();  // Ensure onLoadComplete is called after loading
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
            const index = tooltipItem.dataIndex;
            if (chartData) {
              return [
                `Quantity: ${chartData.datasets[0].data[index]}`,
                `Price: ${chartData.prices[index]} RON`,  // Change to RON currency
                `Type: ${chartData.types[index]}`
              ];
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',  // Light grid lines color
          borderColor: 'white',  // Set the border color of the x-axis to white
        },
        ticks: {
          display: false,  // Hide the tick labels on the x-axis
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,  // Ensure the scale uses integers
          callback: function (value) {
            return Number.isInteger(value) ? value : null;  // Display only integers
          },
          color: 'white',  // Set the tick labels color to white
          font: {
            size: 12,  // Adjust the font size of the y-axis labels
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',  // Light grid lines color
          borderColor: 'white',  // Set the border color of the y-axis to white
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
        <Spinner />  // Display spinner while loading
      ) : (
        <div className='chartContainer'>
          <h2>{chartTitle}</h2>
          {errorMessage ? (
            <p>{errorMessage}</p>  // Display error message if there's any
          ) : (
            <Bar data={chartData} options={options} />  // Render chart if data is available
          )}
        </div>
      )}
    </>
  );
};

export default CurrentMonthChart;
