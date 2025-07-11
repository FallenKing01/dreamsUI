import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../css/chart.css';
import Spinner from '../components/spinner';  

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductChart = ({ adminId }) => {
  const [chartData, setChartData] = useState(null);
  const [dailySalesTitle, setDailySalesTitle] = useState('Top 5 products sold today');
  adminId = localStorage.getItem('userId');



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/charts/currentdaychart/${adminId}`);
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data available');
        }
        // Limit to first 5 items
        const limitedData = data.slice(0, 5);

        // Extracting labels and data for the chart
        const labels = limitedData.map(item => item.productDetails[0]?.name || 'Unknown Product');
        const quantities = limitedData.map(item => item.qtySum || 0);
        const prices = limitedData.map(item => item.productDetails[0]?.price || 0);
        const types = limitedData.map(item => item.productDetails[0]?.type || 'Unknown Type');

        const colors = [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(75, 192, 192, 1)', 
          'rgba(153, 102, 255, 1)'  
        ];

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Quantity Sold',
              data: quantities,
              backgroundColor: colors, // Apply different colors to each bar
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
          prices: prices, 
          types: types    
        });

      } catch (error) {
        setDailySalesTitle('No Sales Today');
        setChartData({
          labels: [],
          datasets: [{ 
            label: 'Quantity Sold', 
            data: [], 
            backgroundColor: 'rgba(75, 192, 192, 0.6)', 
            borderColor: 'rgba(75, 192, 192, 1)' 
          }],
          prices: [],
          types: []
        });
      }
    };

    fetchData();
  }, [adminId]);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const index = tooltipItem.dataIndex;
            if (chartData && chartData.datasets[0].data[index] !== undefined) {
              return [
                `Quantity: ${chartData.datasets[0].data[index]}`,
                `Price: ${chartData.prices[index]} RON`,  // Change to RON currency
                `Type: ${chartData.types[index]}`
              ];
            }
            return [];
          }
        }
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light grid lines color
          borderColor: 'white', // Set the border color of the x-axis to white
          borderWidth: 1, // Set the border width of the x-axis
        },
        ticks: {
          display: false // Hides the labels on the x-axis
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light grid lines color
          borderColor: 'white', // Set the border color of the y-axis to white
          borderWidth: 1, // Set the border width of the y-axis
        },
        ticks: {
          stepSize: 1,  // Ensure the scale uses integers
          callback: function(value) {
            return Number.isInteger(value) ? value : null; // Display only integers
          },
          color: 'white',  // Set the tick labels color to white
          font: {
            size: 12,  // Adjust the font size of the y-axis labels
          },
        },
      }
    },
    animation: {
      duration: 1500,  // Set the duration of animations in milliseconds (1500ms = 1.5 seconds)
      easing: 'easeInOutQuad',  // Use a smoother easing function
    },
  };

  return (
    <>
      {!chartData && (<Spinner />)}
      <div className='chartContainer'>
        <h2>{dailySalesTitle}</h2>
        {chartData && (
          <Bar data={chartData} options={options} />
        )}
        {/* <button className='moreDetailsBtn'>More Details</button> */}
      </div>
    </>
  );
};

export default ProductChart;
