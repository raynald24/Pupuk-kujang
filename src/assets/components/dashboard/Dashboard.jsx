import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [sampleCounts, setSampleCounts] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [displayCounts, setDisplayCounts] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const navigate = useNavigate();

  // Fetch sample counts
  useEffect(() => {
    const fetchSampleCounts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/samples/counts', { withCredentials: true });
        setSampleCounts(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching sample counts:', err);
        setIsLoading(false);
      }
    };

    fetchSampleCounts();
  }, []);

  // Animate count numbers
  useEffect(() => {
    if (!isLoading) {
      const animateCount = (key) => {
        const target = sampleCounts[key];
        let start = 0;
        const duration = 1500;
        const startTime = Date.now();
        
        const timer = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          setDisplayCounts(prev => ({
            ...prev,
            [key]: Math.floor(progress * target)
          }));
          
          if (progress === 1) {
            clearInterval(timer);
          }
        }, 16);
        
        return timer;
      };
      
      const pendingTimer = animateCount('pending');
      const completedTimer = animateCount('completed');
      const cancelledTimer = animateCount('cancelled');
      
      return () => {
        clearInterval(pendingTimer);
        clearInterval(completedTimer);
        clearInterval(cancelledTimer);
      };
    }
  }, [isLoading, sampleCounts]);

  // Navigate to sample page with status filter
  const handleCardClick = (status) => {
    navigate('/sample', { state: { status } });
  };

  // Chart data with enhanced styling
  const chartData = {
    labels: ['Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Task Status Count',
        data: [sampleCounts.pending, sampleCounts.completed, sampleCounts.cancelled],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(239, 68, 68, 0.8)'   // Red
        ],
        borderColor: [
          'rgb(37, 99, 235)',  // Darker blue
          'rgb(5, 150, 105)',  // Darker green
          'rgb(220, 38, 38)'   // Darker red
        ],
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
      },
    ],
  };

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif",
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      title: {
        display: true,
        text: 'Task Status Distribution',
        font: {
          size: 20,
          family: "'Inter', 'Helvetica', 'Arial', sans-serif",
          weight: 'bold'
        },
        color: '#374151',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 1)'
        },
        ticks: {
          font: {
            family: "'Inter', 'Helvetica', 'Arial', sans-serif"
          },
          precision: 0
        }
      }
    }
  };

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      y: 0,
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="bg-gray-100 min-h-screen p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section with animated background */}
        <motion.div 
          className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 p-8 rounded-2xl shadow-lg mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-10"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div 
              className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-400 opacity-10"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
          </div>
          
          <div className="relative flex items-center gap-4 pb-5">
            <motion.div 
              className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={28} className="text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Dashboard
              </motion.h1>
              <motion.h2 
                className="text-blue-100 text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Sample Task Overview
              </motion.h2>
            </div>
          </div>
        </motion.div>

        {/* Task Count Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Pending Tasks Card */}
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center cursor-pointer 
                      transition-all duration-300 bg-white border border-blue-200 hover:bg-blue-50"
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onClick={() => handleCardClick('pending')}
          >
            <div className="flex items-center mb-3">
              <motion.div 
                className="p-3 rounded-lg bg-blue-500/10 mr-3"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock size={24} className="text-blue-600" />
              </motion.div>
              <h3 className="font-semibold text-lg text-left text-gray-700">Pending Tasks</h3>
            </div>
            
            <motion.p 
              className="text-4xl font-bold text-blue-700 mt-2"
              key={displayCounts.pending}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {displayCounts.pending}
            </motion.p>
            
            <motion.div 
              className="h-1 w-1/3 mx-auto mt-4 rounded-full bg-blue-400"
              initial={{ width: "0%" }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Completed Tasks Card */}
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center cursor-pointer 
                      transition-all duration-300 bg-white border border-green-200 hover:bg-green-50"
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onClick={() => handleCardClick('complete')}
          >
            <div className="flex items-center mb-3">
              <motion.div 
                className="p-3 rounded-lg bg-green-500/10 mr-3"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 size={24} className="text-green-600" />
              </motion.div>
              <h3 className="font-semibold text-lg text-left text-gray-700">Completed Tasks</h3>
            </div>
            
            <motion.p 
              className="text-4xl font-bold text-green-700 mt-2"
              key={displayCounts.completed}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {displayCounts.completed}
            </motion.p>
            
            <motion.div 
              className="h-1 w-1/3 mx-auto mt-4 rounded-full bg-green-400"
              initial={{ width: "0%" }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </motion.div>

          {/* Cancelled Tasks Card */}
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center cursor-pointer 
                      transition-all duration-300 bg-white border border-red-200 hover:bg-red-50"
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onClick={() => handleCardClick('cancelled')}
          >
            <div className="flex items-center mb-3">
              <motion.div 
                className="p-3 rounded-lg bg-red-500/10 mr-3"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertCircle size={24} className="text-red-600" />
              </motion.div>
              <h3 className="font-semibold text-lg text-left text-gray-700">Cancelled Tasks</h3>
            </div>
            
            <motion.p 
              className="text-4xl font-bold text-red-700 mt-2"
              key={displayCounts.cancelled}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {displayCounts.cancelled}
            </motion.p>
            
            <motion.div 
              className="h-1 w-1/3 mx-auto mt-4 rounded-full bg-red-400"
              initial={{ width: "0%" }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </motion.div>
        </div>

        {/* Chart Section */}
        <motion.div 
          className="w-full bg-white p-6 rounded-xl shadow-lg mt-8 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="p-2 rounded-lg bg-indigo-100 mr-3"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <BarChart3 size={20} className="text-indigo-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800">Task Status Chart</h3>
          </div>
          
          <div className="mt-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;