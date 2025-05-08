import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [sampleCounts, setSampleCounts] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const navigate = useNavigate(); 

  // Mengambil data jumlah sample berdasarkan status
  useEffect(() => {
    const fetchSampleCounts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/samples/counts', { withCredentials: true });
        setSampleCounts(res.data); // Menyimpan hasil ke dalam state
      } catch (err) {
        console.error('Error fetching sample counts:', err);
      }
    };

    fetchSampleCounts();
  }, []);

  // Fungsi untuk navigate ke halaman Sample dan trigger search otomatis
  const handleCardClick = (status) => {
    navigate('/sample', { state: { status } });
  };

  // Data untuk grafik
  const chartData = {
    labels: ['Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Task Status Count',
        data: [sampleCounts.pending, sampleCounts.completed, sampleCounts.cancelled],
        backgroundColor: ['#0055FF', '#4CAF50', '#FF0000'],
        borderColor: ['#0033CC', '#388E3C', '#F57C00'],
        borderWidth: 1,
      },
    ],
  };

  // Opsi grafik
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Task Status Distribution',
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-xl shadow-lg mb-8">
        <div className="pb-5">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <h2 className="text-gray-200 text-xl">Sample Task Overview</h2>
        </div>
      </div>

      {/* Task Count Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div
          className="p-6 bg-blue-50 rounded-lg shadow-lg text-center cursor-pointer hover:bg-blue-100"
          onClick={() => handleCardClick('pending')} // Klik pending akan mengarahkan ke sample dengan status pending
        >
          <h3 className="font-semibold text-lg">Pending Tasks</h3>
          <p className="text-3xl font-bold text-blue-700">{sampleCounts.pending}</p>
        </div>

        <div
          className="p-6 bg-green-50 rounded-lg shadow-lg text-center cursor-pointer hover:bg-green-100"
          onClick={() => handleCardClick('complete')} // Klik complete
        >
          <h3 className="font-semibold text-lg">Completed Tasks</h3>
          <p className="text-3xl font-bold text-green-700">{sampleCounts.completed}</p>
        </div>

        <div
          className="p-6 bg-yellow-50 rounded-lg shadow-lg text-center cursor-pointer hover:bg-yellow-100"
          onClick={() => handleCardClick('cancelled')} // Klik cancelled
        >
          <h3 className="font-semibold text-lg">Cancelled Tasks</h3>
          <p className="text-3xl font-bold text-red-700">{sampleCounts.cancelled}</p>
        </div>
      </div>

      {/* Grafik Task Status */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-xl font-semibold mb-4">Task Status Chart</h3>
        <Bar data={chartData} options={chartOptions} /> {/* Menampilkan grafik */}
      </div>
    </div>
  );
};

export default Dashboard;
