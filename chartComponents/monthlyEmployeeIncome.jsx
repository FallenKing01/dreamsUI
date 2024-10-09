import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlySalesLineChart = ({ employeeId }) => {
  const [chartData, setChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState('Employee Monthly Sales');
  const [isLoading, setIsLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  // Fetch data on component mount
  useEffect(() => {
    const fetchMonthlySalesData = async () => {
      try {

        // Fetch monthly sales data
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/employeecharts/monthlychart/${employeeId}`);

        // Validate data
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No valid data found');
        }

        // Extract month names and total sales
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const labels = data.map(item => monthNames[item.month - 1]); // Map month numbers to names
        const totalSums = data.map(item => item.totalSum);

        // Check if all total sums are zero
        const allZero = totalSums.every(value => value === 0);

        // Update chart title
        if (allZero) {
          setChartTitle('No sales this year');
        } else {
          setChartTitle('Employee Monthly Sales');
        }

        // Set chart data
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
        setError('No monthly sales data available');
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

    fetchMonthlySalesData();
  }, [employeeId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
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
          stepSize: 10, // Adjust step size based on your data
          color: 'white', // White tick labels
        },
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <div>Loading chart data...</div> // Simple loading message instead of spinner
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='chartContainer' style={{ width: '40%', height: '300px', padding: '50px', margin: '2% 0 0 40%' }}> {/* Set custom width and height */}
          <h2>{chartTitle}</h2>
          <Line data={chartData} options={options} />
        </div>
      )}
    </>
  );
};

export default MonthlySalesLineChart;
