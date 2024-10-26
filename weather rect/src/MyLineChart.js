import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const MyLineChart = ({ dataInput, deviationThreshold }) => {
  const labels = Object.keys(dataInput);
  const dataPoints = Object.values(dataInput).map((x) => +x);

  const averageTemp = dataPoints.reduce((sum, temp) => sum + temp, 0) / (dataPoints.length ? dataPoints.length : 1);
  
  const minY = Math.min(...dataPoints) - 2;
  const maxY = Math.max(...dataPoints) + 2;

  // Identify points that deviate significantly from the average
  const pointStyles = dataPoints.map((temp) => (
    Math.abs(temp - averageTemp) > deviationThreshold ? 'red' : 'rgba(75, 192, 192, 1)'
  ));

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature',
        data: dataPoints,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: pointStyles, // Use the conditional point styles
        pointBorderColor: pointStyles,
        pointRadius: pointStyles.map(color => (color === 'red' ? 5 : 0)), // Show larger points for deviations
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      annotation: {
        annotations: {
          averageLine: {
            type: 'line',
            yMin: averageTemp,
            yMax: averageTemp,
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              content: `Average: ${averageTemp.toFixed(2)}°`,
              enabled: true,
              position: 'end',
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: minY,
        max: maxY,
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <Line data={data} options={options} />
  );
};

export default MyLineChart;
